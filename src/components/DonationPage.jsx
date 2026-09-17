import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Heart, Info, UserRound } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const scripts = new Map();
function loadCheckout(provider) {
  const isCashfree = provider === "cashfree";
  const globalName = isCashfree ? "Cashfree" : "Razorpay";
  if (window[globalName]) return Promise.resolve();
  if (!scripts.has(provider)) scripts.set(provider, new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = isCashfree ? "https://sdk.cashfree.com/js/v3/cashfree.js" : "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => { scripts.delete(provider); script.remove(); reject(new Error("Checkout could not be loaded. Please try again.")); };
    document.body.appendChild(script);
  }));
  return scripts.get(provider);
}

function DonationPage() {
  const [citizen, setCitizen] = useState("indian");
  const frequency = "one-time";
  const [enteredAmount, setAmount] = useState(null);
  const [purpose, setPurpose] = useState("Elder Care");
  const [message, setMessage] = useState("");
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSiteSettings();
  const donationSettings = settings.donation || {};
  const minimum = Math.max(1, Number(donationSettings.minimum_amount) || 1);
  const amounts = (donationSettings.default_amounts ?? "5000,10000,20000").split(",").map(Number).filter((value) => Number.isFinite(value) && value >= minimum);
  const amount = enteredAmount ?? String(amounts[0] || minimum);
  const [gateway, setGateway] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");
  const verifiedReturn = useRef(null);
  useEffect(() => {
    let current = true;
    const load = () => api("/donations/config").then((data) => { if (current) { setGateway(data.gateway); setConfigLoading(false); } }).catch(() => { if (current) { setGateway(null); setConfigLoading(false); } });
    load(); window.addEventListener("focus", load);
    return () => { current = false; window.removeEventListener("focus", load); };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const donationId = params.get("donation_id");
    if (!user || !donationId || verifiedReturn.current === donationId) return;
    verifiedReturn.current = donationId;
    if (params.get("checkout") === "cancelled") { setMessage("Checkout was cancelled. You can check payment status from My Donations."); return; }
    setBusy(true);
    api("/donations/verify", { method: "POST", body: { donationId } }).then((verified) => {
      setMessage("Thank you. Donation " + verified.donationNumber + " has been verified successfully.");
      window.history.replaceState({}, "", "/donate");
    }).catch((error) => setMessage(error.message)).finally(() => setBusy(false));
  }, [user]);

  const chooseAmount = (value) => setAmount(String(value));
  const proceed = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!user) {
      sessionStorage.setItem("sifi_return_to", window.location.pathname + window.location.search);
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < minimum) { setMessage("Please enter at least INR " + minimum + "."); return; }
    setBusy(true); setMessage("");
    try {
      const data = await api("/donations/create-order", { method: "POST", body: { amount: numericAmount, donorName: user.name, email: user.email, phone: phone || user.phone, gatewayId: gateway?.id, message: frequency + " donation for " + purpose } });
      if (data.provider === "stripe") { window.location.assign(data.checkoutUrl); return; }
      await loadCheckout(data.provider);
      if (data.provider === "cashfree") {
        const result = await window.Cashfree({ mode: data.mode }).checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
        if (result?.error) throw new Error(result.error.message || "Checkout could not be opened");
        setBusy(false); return;
      }
      const checkout = new window.Razorpay({
        key: data.publicKey, amount: data.order.amount, currency: data.order.currency,
        name: settings.general?.website_name || "SIFI Foundation", description: "Donation for " + purpose,
        order_id: data.order.id, prefill: { name: user.name, email: user.email, contact: phone || user.phone || "" },
        handler: async (payment) => {
          try {
            const verified = await api("/donations/verify", { method: "POST", body: { ...payment, donationId: data.donation.id } });
            setMessage("Thank you. Donation " + verified.donationNumber + " has been verified successfully.");
          } catch (error) { setMessage(error.message); }
          finally { setBusy(false); }
        },
        modal: { ondismiss: () => { setMessage("Checkout closed. You can check payment status from My Donations."); setBusy(false); } },
        theme: { color: "#176b3a" }
      });
      checkout.on("payment.failed", () => { setMessage("Payment failed. Please try again or check My Donations."); setBusy(false); });
      checkout.open();
    } catch (error) { setMessage(error.message); setBusy(false); }
  };

  return (
    <section className="donation-page">
      <div className="donation-shell">
        <div className="donation-card">
          <div className="citizen-tabs" role="tablist" aria-label="Citizenship">
            <button className={citizen === "indian" ? "active" : ""} onClick={() => setCitizen("indian")} role="tab" aria-selected={citizen === "indian"}>
              {citizen === "indian" ? <CheckCircle2 /> : <Circle />} Indian Citizens
            </button>
            <button className={citizen === "foreign" ? "active" : ""} onClick={() => setCitizen("foreign")} role="tab" aria-selected={citizen === "foreign"}>
              {citizen === "foreign" ? <CheckCircle2 /> : <Circle />} Foreign Citizens/OCI
            </button>
          </div>

          {citizen === "indian" ? <p className="passport-note"><Info /> For Indian Passport holders</p> : <p className="passport-note"><Info /> For foreign citizens and OCI card holders</p>}

          <form onSubmit={proceed}>
            <div className="frequency-tabs"><span><Heart /> One-time donation</span></div>

            <div className="amount-options" aria-label="Select donation amount">
              {amounts.map((value) => <button key={value} type="button" className={amount === String(value) ? "active" : ""} onClick={() => chooseAmount(value)}>₹{value}</button>)}
            </div>

            <label className="donation-field amount-field">
              <span>Enter Your Own<br />Amount <b>*</b></span>
              <input type="number" min={minimum} step="0.01" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Donation amount" required />
            </label>

            <label className="donation-field purpose-field">
              <span>I Pledge My Support For <b>*</b></span>
              <select value={purpose} onChange={(event) => setPurpose(event.target.value)} aria-label="Donation purpose">
                <option>Elder Care</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Food & Nutrition</option>
                <option>Where Needed Most</option>
              </select>
            </label>

            <label className="donation-field"><span>Phone {gateway?.provider === "cashfree" ? "*" : ""}</span><input type="tel" value={phone || user?.phone || ""} onChange={(event) => setPhone(event.target.value)} required={gateway?.provider === "cashfree"} /></label>
            <p role="status">{configLoading ? "Loading payment options..." : gateway ? "Secure checkout with " + gateway.name : "Online donations are currently unavailable. Please contact our team."}</p>
            {donationSettings.donation_note && <p>{donationSettings.donation_note}</p>}
            <button className="proceed-donation" type="submit" disabled={busy || configLoading || authLoading || !gateway}>{busy ? "Processing..." : "Proceed to Donate"}</button>
            {user && <a href="/admin/my-donations">My Donations / Check payment status</a>}
            {message && <p className="donation-message" role="status">{message}</p>}
          </form>

          <div className="donation-divider" />
          <aside className="tax-note">
            <p>As per Indian Income Tax rules, a donor with Indian passport is required to add their Address and PAN number in case they wish to avail the Section 13A (erstwhile Section 80G) tax-exemption certificate.</p>
            <p>No refunds will be entertained after the instant tax exemption has been issued.</p>
          </aside>
          <a className="donor-login" href={user ? "/admin" : "/login"}><UserRound fill="currentColor" /> {user ? "My Dashboard" : "Donor Login"}</a>
        </div>
      </div>
    </section>
  );
}

export default DonationPage;
