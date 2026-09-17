import { useState } from "react";
import { CheckCircle2, Circle, Heart, Info, UserRound } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const amounts = [5000, 10000, 20000];

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

function DonationPage() {
  const [citizen, setCitizen] = useState("indian");
  const [frequency, setFrequency] = useState("one-time");
  const [amount, setAmount] = useState("5000");
  const [purpose, setPurpose] = useState("Elder Care");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const chooseAmount = (value) => setAmount(String(value));
  const proceed = async (event) => {
    event.preventDefault();
    if (!user) {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
    if (!numericAmount || numericAmount < 1) {
      setMessage("Please enter a valid donation amount.");
      return;
    }
    try {
      const data = await api("/donations/create-order", {
        method: "POST",
        body: {
          amount: numericAmount,
          donorName: user.name,
          email: user.email,
          phone: user.phone,
          message: `${frequency} donation for ${purpose}`
        }
      });
      if (!data.razorpayKeyId) {
        setMessage(`Donation order created in test mode. Razorpay order: ${data.order.id}. Add Razorpay keys in backend .env to enable checkout.`);
        return;
      }
      const loaded = await loadRazorpay();
      if (!loaded) {
        setMessage("Razorpay checkout could not be loaded. Please try again.");
        return;
      }
      const checkout = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "SIFI Foundation",
        description: `${frequency} donation for ${purpose}`,
        order_id: data.order.id,
        prefill: { name: user.name, email: user.email, contact: user.phone || "" },
        handler: async (payment) => {
          try {
            const verified = await api("/donations/verify", { method: "POST", body: payment });
            setMessage(`Thank you. Donation ${verified.donationNumber} has been verified successfully.`);
          } catch (error) {
            setMessage(error.message);
          }
        },
        modal: { ondismiss: () => setMessage("Payment was not completed.") },
        theme: { color: "#176b3a" }
      });
      checkout.open();
    } catch (error) {
      setMessage(error.message);
    }
    return;
    setMessage(`Thank you. Your ${frequency === "one-time" ? "one-time" : "monthly"} pledge of ₹${numericAmount.toLocaleString("en-IN")} for ${purpose} is ready to continue.`);
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
            <div className="frequency-tabs" role="group" aria-label="Donation frequency">
              <button type="button" className={frequency === "one-time" ? "active" : ""} onClick={() => setFrequency("one-time")}><Heart fill="currentColor" /> One Time</button>
              <button type="button" className={frequency === "monthly" ? "active" : ""} onClick={() => setFrequency("monthly")}><Heart fill="currentColor" /> Monthly</button>
            </div>

            <div className="amount-options" aria-label="Select donation amount">
              {amounts.map((value) => <button key={value} type="button" className={amount === String(value) ? "active" : ""} onClick={() => chooseAmount(value)}>₹{value}</button>)}
            </div>

            <label className="donation-field amount-field">
              <span>Enter Your Own<br />Amount <b>*</b></span>
              <input type="number" min="1" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Donation amount" required />
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

            <button className="proceed-donation" type="submit">Proceed to Donate</button>
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
