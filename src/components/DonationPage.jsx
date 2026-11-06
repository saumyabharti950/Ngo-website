import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Heart,
  Info,
  UserRound,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Lock,
  Receipt
} from "lucide-react";

import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const scripts = new Map();

function loadCheckout(provider) {
  const isCashfree = provider === "cashfree";
  const globalName = isCashfree ? "Cashfree" : "Razorpay";

  if (window[globalName]) {
    return Promise.resolve();
  }

  if (!scripts.has(provider)) {
    scripts.set(
      provider,
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = isCashfree
          ? "https://sdk.cashfree.com/js/v3/cashfree.js"
          : "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve();
        script.onerror = () => {
          scripts.delete(provider);
          script.remove();
          reject(new Error("Payment gateway checkout could not be loaded. Please check your internet connection."));
        };

        document.body.appendChild(script);
      })
    );
  }

  return scripts.get(provider);
}

function DonationPage({ modal = false, onClose }) {
  // Step state (1: Amount & Cause, 2: Donor Info, 3: Review & Pay)
  const [step, setStep] = useState(1);

  const [citizen, setCitizen] = useState("indian");
  const [frequency, setFrequency] = useState("one-time");
  const [enteredAmount, setAmount] = useState(null);
  const [purpose, setPurpose] = useState("Elder Care");
  const [message, setMessage] = useState("");

  // Donor Details
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneOverflow, setPhoneOverflow] = useState(false);

  // 80G Tax Exemption
  const [needTaxExemption, setNeedTaxExemption] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [anonymousDonation, setAnonymousDonation] = useState(false);

  // Simulation Modal State
  const [simulatedCheckout, setSimulatedCheckout] = useState(null);
  const [simMethod, setSimMethod] = useState("upi");
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const donationSettings = settings?.donation || {};

  const minimum = Math.max(1, Number(donationSettings.minimum_amount) || 1);
  const defaultAmountsList = String(donationSettings.default_amounts || "500,1000,2500,5000,10000")
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v >= minimum);

  const safeAmounts = defaultAmountsList.length > 0 ? defaultAmountsList : [500, 1000, 2500, 5000];
  const amount = enteredAmount !== null ? enteredAmount : String(safeAmounts[1] || safeAmounts[0]);

  const [gateway, setGateway] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (!donorName && user.name) setDonorName(user.name);
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) {
        const digits = String(user.phone).replace(/\D/g, "");
        const cleaned = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
        setPhone(cleaned.slice(-10));
      }
    }
  }, [user]);

  // Load gateway config
  useEffect(() => {
    let current = true;
    const loadGateway = async () => {
      try {
        setConfigLoading(true);
        const data = await api("/donations/config");
        if (current) setGateway(data?.gateway || null);
      } catch (error) {
        if (current) {
          setGateway(null);
          setMessage(error?.message || "Unable to load payment gateway configuration.");
        }
      } finally {
        if (current) setConfigLoading(false);
      }
    };

    loadGateway();
    window.addEventListener("focus", loadGateway);
    return () => {
      current = false;
      window.removeEventListener("focus", loadGateway);
    };
  }, []);

  // Check if returning from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const donationId = params.get("donation_id");
    const checkout = params.get("checkout");

    if (donationId && checkout === "return") {
      window.location.href = `/thank-you?donation_id=${donationId}&checkout=return`;
      return;
    }

    if (checkout === "cancelled") {
      setMessage("Checkout was cancelled. You can try again whenever you are ready.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Phone validation
  const phoneError = phoneOverflow
    ? "Mobile number cannot exceed 10 digits."
    : phoneTouched && !/^[6-9][0-9]{9}$/.test(phone)
      ? phone.length > 0
        ? "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
        : "Mobile number is required."
      : "";

  const updatePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPhoneTouched(true);
    setPhoneOverflow(digits.length > 10);
    setPhone(digits.slice(0, 10));
    setMessage("");
  };

  const chooseAmount = (val) => {
    setAmount(String(val));
    setMessage("");
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const num = Number(amount);
    if (!Number.isFinite(num) || num < minimum) {
      setMessage(`Please enter at least ₹${minimum}.`);
      return false;
    }
    setMessage("");
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!donorName.trim()) {
      setMessage("Please enter your full name.");
      return false;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    setPhoneTouched(true);
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (needTaxExemption) {
      if (!panNumber.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(panNumber.trim())) {
        setMessage("A valid 10-character PAN number (e.g. ABCDE1234F) is required for 80G tax receipt.");
        return false;
      }
    }
    setMessage("");
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    setMessage("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Payment Execution (Step 3)
  const proceedPayment = async (event) => {
    event.preventDefault();
    if (busy) return;

    if (!validateStep1() || !validateStep2()) return;

    if (configLoading) {
      setMessage("Payment configuration is still loading. Please wait.");
      return;
    }

    if (!gateway?.id) {
      setMessage("Online donations are temporarily unavailable. Please try again later or contact our team.");
      return;
    }

    try {
      setBusy(true);
      setMessage("Creating your secure payment session...");

      const fullPhone = "+91" + phone;
      const numericAmount = Number(amount);

      const orderPayload = {
        amount: numericAmount,
        donorName: donorName.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhone,
        citizen,
        donationType: frequency,
        gatewayId: gateway.id,
        message: `${frequency} donation for ${purpose}`,
        anonymousDonation,
        ...(needTaxExemption ? {
          panNumber: panNumber.trim().toUpperCase(),
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim()
        } : {})
      };

      const data = await api("/donations/create-order", {
        method: "POST",
        body: orderPayload
      });

      const provider = data?.provider || gateway.provider;

      // Handle Stripe
      if (provider === "stripe") {
        if (!data?.checkoutUrl) throw new Error("Stripe checkout URL was not received.");
        window.location.assign(data.checkoutUrl);
        return;
      }

      // CASHFREE INTEGRATION
      if (provider === "cashfree") {
        // If simulated mode (e.g. random/placeholder test keys)
        if (data.isSimulated || data.paymentSessionId?.startsWith("cf_sim_")) {
          setSimulatedCheckout(data);
          setMessage("");
          setBusy(false);
          return;
        }

        if (!data?.paymentSessionId) {
          throw new Error("Cashfree payment session was not generated. Please try again.");
        }

        setMessage("Opening Cashfree Payments...");
        await loadCheckout(provider);

        const cashfreeMode = data.mode === "production" ? "production" : "sandbox";
        const cashfree = window.Cashfree({ mode: cashfreeMode });

        await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self"
        });

        setBusy(false);
        return;
      }

      // RAZORPAY INTEGRATION
      if (provider === "razorpay") {
        await loadCheckout(provider);
        if (!data?.publicKey || !data?.order?.id) {
          throw new Error("Razorpay configuration missing.");
        }

        const checkout = new window.Razorpay({
          key: data.publicKey,
          amount: data.order.amount,
          currency: data.order.currency || "INR",
          name: settings?.general?.website_name || "SIFI Foundation",
          description: `Donation for ${purpose}`,
          order_id: data.order.id,
          prefill: {
            name: donorName,
            email: email,
            contact: fullPhone
          },
          theme: { color: "#0f766e" },
          handler: async (payment) => {
            try {
              setBusy(true);
              setMessage("Verifying your payment...");
              const verified = await api("/donations/verify", {
                method: "POST",
                body: {
                  ...payment,
                  donationId: data.donation?.id
                }
              });

              const finalId = verified?.id || data.donation?.id;
              window.location.href = `/thank-you?donation_id=${finalId}&checkout=return`;
            } catch (error) {
              setMessage(error?.message || "Payment completed, but verification had an issue. Please contact support.");
            } finally {
              setBusy(false);
            }
          },
          modal: {
            ondismiss: () => {
              setMessage("Payment process closed. You can retry whenever you are ready.");
              setBusy(false);
            }
          }
        });

        checkout.open();
      }
    } catch (err) {
      setMessage(err?.message || "Something went wrong while initiating the payment. Please try again.");
      setBusy(false);
    }
  };

  const content = (
    <div className="donation-shell">
      <div className="donation-card-modern">
        {modal && (
          <button type="button" className="donation-modal-close" onClick={onClose} aria-label="Close donation form">
            ×
          </button>
        )}

        {/* Header & Steps Tracker */}
        <div className="donation-header">
          <span className="donation-eyebrow">
            <Heart size={14} className="heart-icon" /> Support Our Mission
          </span>
          <h2>Make a Life-Changing Donation</h2>
          <p className="donation-lead">
            Every rupee brings care, nutrition, and hope to elderly and underprivileged individuals.
          </p>

          <div className="donation-steps-nav">
            <div className={`step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
              <span className="step-circle">{step > 1 ? "✓" : "1"}</span>
              <span className="step-label">Amount & Cause</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
              <span className="step-circle">{step > 2 ? "✓" : "2"}</span>
              <span className="step-label">Donor Info</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step === 3 ? "active" : ""}`}>
              <span className="step-circle">3</span>
              <span className="step-label">Confirm & Pay</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Amount & Cause */}
        {step === 1 && (
          <form onSubmit={handleNext} className="donation-step-form">
            <div className="citizen-tabs" role="tablist" aria-label="Citizenship">
              <button
                type="button"
                className={citizen === "indian" ? "active" : ""}
                onClick={() => setCitizen("indian")}
                role="tab"
                aria-selected={citizen === "indian"}
              >
                {citizen === "indian" ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                Indian Citizens (₹ INR)
              </button>
              <button
                type="button"
                className={citizen === "foreign" ? "active" : ""}
                onClick={() => setCitizen("foreign")}
                role="tab"
                aria-selected={citizen === "foreign"}
              >
                {citizen === "foreign" ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                NRI / Foreign Citizens
              </button>
            </div>

            <p className="passport-note">
              <Info size={16} />
              {citizen === "indian"
                ? "For Indian Passport & bank account holders. Eligible for Section 80G tax deduction."
                : "For NRI and Foreign passport holders."}
            </p>

            <div className="donation-frequency-row">
              <button
                type="button"
                className={`freq-btn ${frequency === "one-time" ? "active" : ""}`}
                onClick={() => setFrequency("one-time")}
              >
                <Heart size={16} /> One-time Contribution
              </button>
              <button
                type="button"
                className={`freq-btn ${frequency === "monthly" ? "active" : ""}`}
                onClick={() => setFrequency("monthly")}
              >
                <Sparkles size={16} /> Monthly Support
              </button>
            </div>

            <div className="amount-section-title">Select Donation Amount:</div>
            <div className="amount-options" aria-label="Select donation amount">
              {safeAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={amount === String(val) ? "active" : ""}
                  onClick={() => chooseAmount(val)}
                >
                  ₹{val.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <div className="donation-input-group">
              <label htmlFor="custom-amount">Or Enter Custom Amount (₹) *</label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">₹</span>
                <input
                  id="custom-amount"
                  type="number"
                  min={minimum}
                  step="1"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMessage("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="donation-input-group">
              <label htmlFor="donation-purpose">Select Cause to Support *</label>
              <select
                id="donation-purpose"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  setMessage("");
                }}
                required
              >
                <option value="Elder Care">Elder Care & Senior Medical Shelter</option>
                <option value="Healthcare & Medical">Emergency Healthcare & Hospital Assistance</option>
                <option value="Child Education">Child Education & Youth Sponsorship</option>
                <option value="Food & Nutrition">Food Security & Nutrition Drive</option>
                <option value="Where Needed Most">Where Needed Most (Unrestricted Fund)</option>
              </select>
            </div>

            {message && <div className="donation-error-alert"><AlertCircle size={16} /> {message}</div>}

            <button type="submit" className="donation-btn-primary">
              Continue to Donor Details <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: Donor Details */}
        {step === 2 && (
          <form onSubmit={handleNext} className="donation-step-form">
            <div className="step-headline">
              <h3>Donor Information</h3>
              <p>Your information is completely safe and used strictly for official tax receipts.</p>
            </div>

            <div className="form-grid-2">
              <div className="donation-input-group">
                <label htmlFor="donor-name">Full Name *</label>
                <input
                  id="donor-name"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={donorName}
                  onChange={(e) => {
                    setDonorName(e.target.value);
                    setMessage("");
                  }}
                  required
                />
              </div>

              <div className="donation-input-group">
                <label htmlFor="donor-email">Email Address *</label>
                <input
                  id="donor-email"
                  type="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                  }}
                  required
                />
              </div>
            </div>

            <div className={`donation-input-group ${phoneError ? "has-error" : ""}`}>
              <label htmlFor="donor-phone">Mobile Number *</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  id="donor-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={updatePhone}
                  onBlur={() => setPhoneTouched(true)}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              {phoneError && <small className="field-error">{phoneError}</small>}
            </div>

            <div className="tax-exemption-toggle">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={needTaxExemption}
                  onChange={(e) => setNeedTaxExemption(e.target.checked)}
                />
                <span>
                  <strong>I want an 80G Tax Exemption Certificate</strong>
                  <small>Receive instant tax exemption certificate under Section 80G of Income Tax Act.</small>
                </span>
              </label>
            </div>

            {needTaxExemption && (
              <div className="tax-fields-block">
                <div className="donation-input-group">
                  <label htmlFor="donor-pan">PAN Card Number *</label>
                  <input
                    id="donor-pan"
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="font-mono text-uppercase"
                    value={panNumber}
                    onChange={(e) => {
                      setPanNumber(e.target.value.toUpperCase());
                      setMessage("");
                    }}
                    required={needTaxExemption}
                  />
                  <small className="help-text">Mandatory by Income Tax department for 80G certificate.</small>
                </div>

                <div className="donation-input-group">
                  <label htmlFor="donor-address">Address</label>
                  <input
                    id="donor-address"
                    type="text"
                    placeholder="House / Street / Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-grid-3">
                  <div className="donation-input-group">
                    <label htmlFor="donor-city">City</label>
                    <input
                      id="donor-city"
                      type="text"
                      placeholder="e.g. Ranchi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="donation-input-group">
                    <label htmlFor="donor-state">State</label>
                    <input
                      id="donor-state"
                      type="text"
                      placeholder="e.g. Jharkhand"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>
                  <div className="donation-input-group">
                    <label htmlFor="donor-pin">Pincode</label>
                    <input
                      id="donor-pin"
                      type="text"
                      maxLength={6}
                      placeholder="834001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                  </div>
                </div>
              </div>
            )}

            <label className="checkbox-label anonymous-option">
              <input
                type="checkbox"
                checked={anonymousDonation}
                onChange={(e) => setAnonymousDonation(e.target.checked)}
              />
              <span>Make this donation anonymous (hide name on public donor list)</span>
            </label>

            {message && <div className="donation-error-alert"><AlertCircle size={16} /> {message}</div>}

            <div className="step-actions-row">
              <button type="button" onClick={handleBack} className="btn-back">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="donation-btn-primary">
                Review & Proceed <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Confirm & Pay */}
        {step === 3 && (
          <form onSubmit={proceedPayment} className="donation-step-form">
            <div className="step-headline">
              <h3>Review & Secure Checkout</h3>
              <p>Please check your donation details before completing payment.</p>
            </div>

            <div className="summary-card">
              <div className="summary-row total-row">
                <span>Total Donation Amount</span>
                <strong className="summary-amount">₹{Number(amount).toLocaleString("en-IN")}</strong>
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span>Cause</span>
                <strong>{purpose}</strong>
              </div>
              <div className="summary-row">
                <span>Frequency</span>
                <strong>{frequency === "one-time" ? "One-time donation" : "Monthly support"}</strong>
              </div>
              <div className="summary-row">
                <span>Donor</span>
                <strong>{donorName}</strong>
              </div>
              <div className="summary-row">
                <span>Contact</span>
                <span>{email} | +91 {phone}</span>
              </div>
              {needTaxExemption && panNumber && (
                <div className="summary-row">
                  <span>80G Exemption PAN</span>
                  <span className="font-mono font-bold text-success">{panNumber}</span>
                </div>
              )}
            </div>

            <div className="payment-security-box">
              <div className="security-item">
                <ShieldCheck size={20} className="text-success" />
                <span>
                  <strong>100% Secure Transaction</strong>
                  <small>
                    Powered by{" "}
                    {gateway?.provider === "cashfree"
                      ? "Cashfree Payments (UPI, Cards, NetBanking)"
                      : gateway?.provider === "razorpay"
                        ? "Razorpay"
                        : "SSL 256-bit Encrypted Gateway"}
                  </small>
                </span>
              </div>
              <div className="security-item">
                <Receipt size={20} className="text-primary" />
                <span>
                  <strong>Instant 80G Receipt</strong>
                  <small>Generated automatically on our Thank You page.</small>
                </span>
              </div>
            </div>

            {message && <div className="donation-error-alert"><AlertCircle size={16} /> {message}</div>}

            <div className="step-actions-row">
              <button type="button" onClick={handleBack} className="btn-back" disabled={busy}>
                <ArrowLeft size={16} /> Edit Details
              </button>
              <button
                type="submit"
                className="donation-btn-pay"
                disabled={busy || configLoading}
              >
                <Lock size={18} />
                {busy ? "Connecting to Payment Gateway..." : `Pay ₹${Number(amount).toLocaleString("en-IN")} Now`}
              </button>
            </div>
          </form>
        )}

        <div className="donation-card-footer">
          <p className="tax-compliance-text">
            All donations are eligible for tax exemption under Section 80G / 13A of Income Tax Act 1961. No login is required to donate.
          </p>

          <div className="account-switch">
            {user ? (
              <span className="logged-in-note">
                Logged in as <strong>{user.name}</strong> (<a href="/admin">My Dashboard</a>)
              </span>
            ) : (
              <a href="/login" className="optional-login-link">
                <UserRound size={14} /> Official / Donor Login
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Cashfree Sandbox Simulation Modal for local testing with dummy/test keys */}
      {simulatedCheckout && (
        <div className="crud-overlay" role="dialog" aria-modal="true">
          <div className="crud-modal cashfree-sim-modal">
            <div className="sim-modal-header">
              <div className="sim-brand">
                <span className="cf-logo-pill">Cashfree</span>
                <span className="cf-sub">Payments (Sandbox Demo)</span>
              </div>
              <button
                type="button"
                className="sim-close-btn"
                onClick={() => setSimulatedCheckout(null)}
                aria-label="Close test payment"
              >
                ×
              </button>
            </div>

            <div className="sim-modal-body">
              <div className="sim-amount-badge">
                <span className="sim-amount-label">Paying To</span>
                <strong className="sim-merchant-name">{settings?.general?.website_name || "SIFI Foundation"}</strong>
                <span className="sim-paying-amount">₹{Number(simulatedCheckout.donation?.amount || amount).toLocaleString("en-IN")}</span>
              </div>

              <div className="sim-notice-alert">
                <Info size={16} />
                <span>
                  <strong>Sandbox Simulator Active:</strong> Test credentials are being used. This simulator verifies payment flow, generates the 80G receipt, and saves full records to your Admin Dashboard.
                </span>
              </div>

              <div className="sim-method-selector">
                <label className="sim-method-heading">Choose Test Payment Method:</label>
                <div className="sim-options-grid">
                  <label className={`sim-opt ${simMethod === "upi" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="sim_method"
                      value="upi"
                      checked={simMethod === "upi"}
                      onChange={() => setSimMethod("upi")}
                    />
                    <span>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                  </label>
                  <label className={`sim-opt ${simMethod === "card" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="sim_method"
                      value="card"
                      checked={simMethod === "card"}
                      onChange={() => setSimMethod("card")}
                    />
                    <span>Credit / Debit Card (Visa, MasterCard, RuPay)</span>
                  </label>
                  <label className={`sim-opt ${simMethod === "netbanking" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="sim_method"
                      value="netbanking"
                      checked={simMethod === "netbanking"}
                      onChange={() => setSimMethod("netbanking")}
                    />
                    <span>Net Banking (SBI, HDFC, ICICI, Axis)</span>
                  </label>
                </div>
              </div>

              <div className="sim-actions">
                <button
                  type="button"
                  className="donation-btn-pay sim-pay-btn"
                  disabled={simulatingPayment}
                  onClick={async () => {
                    try {
                      setSimulatingPayment(true);
                      await api("/donations/verify", {
                        method: "POST",
                        body: {
                          donationId: simulatedCheckout.donation?.id,
                          simulated: true,
                          method: simMethod
                        }
                      });
                      window.location.href = `/thank-you?donation_id=${simulatedCheckout.donation?.id}&checkout=return`;
                    } catch (err) {
                      alert("Simulation error: " + err.message);
                      setSimulatingPayment(false);
                    }
                  }}
                >
                  <ShieldCheck size={18} />
                  {simulatingPayment
                    ? "Completing Payment..."
                    : `Simulate Successful Payment (₹${Number(simulatedCheckout.donation?.amount || amount).toLocaleString("en-IN")})`}
                </button>
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => setSimulatedCheckout(null)}
                  disabled={simulatingPayment}
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (modal) {
    return (
      <div className="donation-modal-overlay" role="dialog" aria-modal="true" aria-label="Donation form">
        {content}
      </div>
    );
  }

  return <section className="donation-page-section">{content}</section>;
}

export default DonationPage;
