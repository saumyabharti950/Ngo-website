import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Heart,
  Info,
  UserRound,
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

          reject(
            new Error(
              "Payment checkout could not be loaded. Please try again."
            )
          );
        };

        document.body.appendChild(script);
      })
    );
  }

  return scripts.get(provider);
}

function DonationPage({ modal = false, onClose }) {
  const [citizen, setCitizen] = useState("indian");

  const frequency = "one-time";

  const [enteredAmount, setAmount] = useState(null);
  const [purpose, setPurpose] = useState("Elder Care");
  const [message, setMessage] = useState("");

  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const donationSettings = settings?.donation || {};

  const minimum = Math.max(
    1,
    Number(donationSettings.minimum_amount) || 1
  );

  const amounts = String(
    donationSettings.default_amounts || "5000,10000,20000"
  )
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(
      (value) =>
        Number.isFinite(value) &&
        value >= minimum
    );

  const safeAmounts =
    amounts.length > 0 ? amounts : [minimum];

  const amount =
    enteredAmount !== null
      ? enteredAmount
      : String(safeAmounts[0]);

  const [gateway, setGateway] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneOverflow, setPhoneOverflow] = useState(false);

  const verifiedReturn = useRef(null);

  /*
   * ---------------------------------------------------------
   * Phone validation
   * ---------------------------------------------------------
   */

  const phoneError = phoneOverflow
    ? "Mobile number cannot be more than 10 digits."
    : phoneTouched && !/^[6-9][0-9]{9}$/.test(phone)
      ? phone.length > 0
        ? "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
        : "Mobile number is required."
      : "";

  /*
   * ---------------------------------------------------------
   * Load logged-in user's phone number
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!user?.phone || phone) {
      return;
    }

    const digits = String(user.phone).replace(/\D/g, "");

    const cleanedPhone =
      digits.startsWith("91") && digits.length === 12
        ? digits.slice(2)
        : digits;

    setPhone(cleanedPhone.slice(-10));
  }, [user?.phone, phone]);

  /*
   * ---------------------------------------------------------
   * Load payment gateway configuration
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let current = true;

    const loadGateway = async () => {
      try {
        setConfigLoading(true);

        const data = await api("/donations/config");

        if (!current) {
          return;
        }

        setGateway(data?.gateway || null);
      } catch (error) {
        if (!current) {
          return;
        }

        setGateway(null);
        setMessage(
          error?.message ||
            "Unable to load payment gateway configuration."
        );
      } finally {
        if (current) {
          setConfigLoading(false);
        }
      }
    };

    loadGateway();

    window.addEventListener("focus", loadGateway);

    return () => {
      current = false;
      window.removeEventListener("focus", loadGateway);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Verify payment after redirect
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const donationId = params.get("donation_id");

    if (
      !user ||
      !donationId ||
      verifiedReturn.current === donationId
    ) {
      return;
    }

    verifiedReturn.current = donationId;

    if (params.get("checkout") === "cancelled") {
      setMessage(
        "Checkout was cancelled. You can check payment status from My Donations."
      );

      window.history.replaceState(
        {},
        "",
        window.location.pathname
      );

      return;
    }

    const verifyDonation = async () => {
      try {
        setBusy(true);
        setMessage("");

        const verified = await api(
          "/donations/verify",
          {
            method: "POST",
            body: {
              donationId,
            },
          }
        );

        setMessage(
          `Thank you. Donation ${
            verified?.donationNumber || ""
          } has been verified successfully.`
        );

        window.history.replaceState(
          {},
          "",
          window.location.pathname
        );
      } catch (error) {
        setMessage(
          error?.message ||
            "Unable to verify your donation."
        );
      } finally {
        setBusy(false);
      }
    };

    verifyDonation();
  }, [user]);

  /*
   * ---------------------------------------------------------
   * Select donation amount
   * ---------------------------------------------------------
   */

  const chooseAmount = (value) => {
    setAmount(String(value));
    setMessage("");
  };

  /*
   * ---------------------------------------------------------
   * Mobile number
   * ---------------------------------------------------------
   */

  const updatePhone = (event) => {
    const digits = event.target.value.replace(/\D/g, "");

    setPhoneTouched(true);
    setPhoneOverflow(digits.length > 10);
    setPhone(digits.slice(0, 10));
    setMessage("");
  };

  /*
   * ---------------------------------------------------------
   * Login redirect
   * ---------------------------------------------------------
   */

  const redirectToLogin = () => {
    sessionStorage.setItem(
      "sifi_return_to",
      window.location.pathname +
        window.location.search
    );

    window.history.pushState(
      {},
      "",
      "/login"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /*
   * ---------------------------------------------------------
   * Payment process
   * ---------------------------------------------------------
   */

  const proceed = async (event) => {
    event.preventDefault();

    if (busy) {
      return;
    }

    /*
     * User must be logged in
     */

    if (!user) {
      redirectToLogin();
      return;
    }

    /*
     * Validate amount
     */

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < minimum
    ) {
      setMessage(
        `Please enter at least INR ${minimum}.`
      );

      return;
    }

    /*
     * Validate mobile number
     */

    setPhoneTouched(true);

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    /*
     * Payment gateway must be configured
     */

    if (configLoading) {
      setMessage(
        "Payment configuration is still loading. Please wait."
      );

      return;
    }

    if (!gateway?.id) {
      setMessage(
        "Payment gateway is currently unavailable. Please try again later."
      );

      return;
    }

    try {
      setBusy(true);
      setMessage("");

      const fullPhone = "+91" + phone;

      /*
       * Create donation/order on backend
       */

      const data = await api(
        "/donations/create-order",
        {
          method: "POST",
          body: {
            amount: numericAmount,
            donorName: user.name,
            email: user.email,
            phone: fullPhone,
            donationType: frequency,
            gatewayId: gateway.id,
            message:
              `${frequency} donation for ${purpose}`,
          },
        }
      );

      /*
       * Stripe
       */

      if (
        data?.provider === "stripe"
      ) {
        if (!data?.checkoutUrl) {
          throw new Error(
            "Stripe checkout URL was not received."
          );
        }

        window.location.assign(
          data.checkoutUrl
        );

        return;
      }

      /*
       * Load Cashfree / Razorpay SDK
       */

      if (
        data?.provider !== "cashfree" &&
        data?.provider !== "razorpay"
      ) {
        throw new Error(
          "Unsupported payment gateway."
        );
      }

      await loadCheckout(data.provider);

      /*
       * Cashfree
       */

      if (data.provider === "cashfree") {
        if (!data.paymentSessionId) {
          throw new Error(
            "Cashfree payment session was not received."
          );
        }

        const cashfree = window.Cashfree({
          mode: data.mode || "sandbox",
        });

        const result =
          await cashfree.checkout({
            paymentSessionId:
              data.paymentSessionId,
            redirectTarget: "_self",
          });

        if (result?.error) {
          throw new Error(
            result.error.message ||
              "Cashfree checkout could not be opened."
          );
        }

        setBusy(false);
        return;
      }

      /*
       * Razorpay
       */

      if (!data?.publicKey) {
        throw new Error(
          "Razorpay public key was not received."
        );
      }

      if (!data?.order?.id) {
        throw new Error(
          "Razorpay order ID was not received."
        );
      }

      const checkout =
        new window.Razorpay({
          key: data.publicKey,

          amount: data.order.amount,

          currency:
            data.order.currency || "INR",

          name:
            settings?.general?.website_name ||
            "SIFI Foundation",

          description:
            `Donation for ${purpose}`,

          order_id: data.order.id,

          prefill: {
            name: user.name || "",
            email: user.email || "",
            contact: "+91" + phone,
          },

          handler: async (payment) => {
            try {
              setBusy(true);
              setMessage(
                "Verifying your payment..."
              );

              const verified =
                await api(
                  "/donations/verify",
                  {
                    method: "POST",
                    body: {
                      ...payment,
                      donationId:
                        data.donation?.id,
                    },
                  }
                );

              setMessage(
                `Thank you. Donation ${
                  verified?.donationNumber || ""
                } has been verified successfully.`
              );
            } catch (error) {
              setMessage(
                error?.message ||
                  "Payment was received but verification failed. Please check My Donations."
              );
            } finally {
              setBusy(false);
            }
          },

          modal: {
            ondismiss: () => {
              setMessage(
                "Checkout closed. You can check payment status from My Donations."
              );

              setBusy(false);
            },
          },

          theme: {
            color: "#176b3a",
          },
        });

      checkout.on(
        "payment.failed",
        () => {
          setMessage(
            "Payment failed. Please try again or check My Donations."
          );

          setBusy(false);
        }
      );

      checkout.open();
    } catch (error) {
      setMessage(
        error?.message ||
          "Something went wrong while processing your donation."
      );

      setBusy(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Page content
   * ---------------------------------------------------------
   */

  const content = (
    <div className="donation-shell">
      <div className="donation-card">

        {modal && (
          <button
            type="button"
            className="donation-modal-close"
            onClick={onClose}
            aria-label="Close donation form"
          >
            ×
          </button>
        )}

        {/* Citizenship */}

        <div
          className="citizen-tabs"
          role="tablist"
          aria-label="Citizenship"
        >
          <button
            type="button"
            className={
              citizen === "indian"
                ? "active"
                : ""
            }
            onClick={() =>
              setCitizen("indian")
            }
            role="tab"
            aria-selected={
              citizen === "indian"
            }
          >
            {citizen === "indian" ? (
              <CheckCircle2 />
            ) : (
              <Circle />
            )}

            Indian Citizens
          </button>

          <button
            type="button"
            className={
              citizen === "foreign"
                ? "active"
                : ""
            }
            onClick={() =>
              setCitizen("foreign")
            }
            role="tab"
            aria-selected={
              citizen === "foreign"
            }
          >
            {citizen === "foreign" ? (
              <CheckCircle2 />
            ) : (
              <Circle />
            )}

            Foreign Citizens/OCI
          </button>
        </div>

        {/* Passport information */}

        {citizen === "indian" ? (
          <p className="passport-note">
            <Info />
            For Indian Passport holders
          </p>
        ) : (
          <p className="passport-note">
            <Info />
            For foreign citizens and OCI card holders
          </p>
        )}

        {/* Donation form */}

        <form onSubmit={proceed}>

          {/* Frequency */}

          <div
            className="frequency-tabs"
            aria-label="Donation frequency"
          >
            <button
              type="button"
              className="active"
              aria-pressed="true"
            >
              <Heart />
              One-time donation
            </button>
          </div>

          {/* Amount buttons */}

          <div
            className="amount-options"
            aria-label="Select donation amount"
          >
            {safeAmounts.map((value) => (
              <button
                key={value}
                type="button"
                className={
                  amount === String(value)
                    ? "active"
                    : ""
                }
                onClick={() =>
                  chooseAmount(value)
                }
              >
                ₹{value}
              </button>
            ))}
          </div>

          {/* Custom amount */}

          <label className="donation-field amount-field">
            <span>
              Enter Your Own
              <br />
              Amount <b>*</b>
            </span>

            <input
              type="number"
              min={minimum}
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                setAmount(
                  event.target.value
                );
                setMessage("");
              }}
              aria-label="Donation amount"
              required
            />
          </label>

          {/* Purpose */}

          <label className="donation-field purpose-field">
            <span>
              I Pledge My Support For{" "}
              <b>*</b>
            </span>

            <select
              value={purpose}
              onChange={(event) => {
                setPurpose(
                  event.target.value
                );
                setMessage("");
              }}
              aria-label="Donation purpose"
              required
            >
              <option>
                Elder Care
              </option>

              <option>
                Education
              </option>

              <option>
                Healthcare
              </option>

              <option>
                Food & Nutrition
              </option>

              <option>
                Where Needed Most
              </option>
            </select>
          </label>

          {/* Mobile */}

          <label
            className={`donation-field phone-field${
              phoneError
                ? " has-error"
                : ""
            }`}
          >
            <span>
              Mobile Number <b>*</b>
            </span>

            <span className="phone-input-wrap">
              <span
                className="phone-prefix"
                aria-hidden="true"
              >
                +91
              </span>

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={updatePhone}
                onBlur={() =>
                  setPhoneTouched(true)
                }
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                placeholder="10-digit mobile number"
                aria-invalid={Boolean(
                  phoneError
                )}
                aria-describedby="donation-phone-error"
                required
              />
            </span>

            <small
              id="donation-phone-error"
              className="field-error"
              aria-live="polite"
            >
              {phoneError}
            </small>
          </label>

          {/* Payment message */}

          {message && (
            <div
              className="donation-message"
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            className="donation-submit"
            disabled={
              busy || configLoading
            }
          >
            {busy
              ? "Processing..."
              : configLoading
                ? "Loading Payment..."
                : `Donate ₹${amount || 0}`}
          </button>
        </form>

        {/* Divider */}

        <div className="donation-divider" />

        {/* Tax information */}

        <aside className="tax-note">
          <p>
            As per Indian Income Tax rules, a
            donor with Indian passport is
            required to add their Address and
            PAN number in case they wish to
            avail the Section 13A (erstwhile
            Section 80G) tax-exemption
            certificate.
          </p>

          <p>
            No refunds will be entertained
            after the instant tax exemption
            has been issued.
          </p>
        </aside>

        {/* Donor login */}

        <a
          className="donor-login"
          href={
            user ? "/admin" : "/login"
          }
        >
          <UserRound
            fill="currentColor"
          />

          {user
            ? "My Dashboard"
            : "Donor Login"}
        </a>

      </div>
    </div>
  );

  /*
   * ---------------------------------------------------------
   * Modal / normal page
   * ---------------------------------------------------------
   */

  if (modal) {
    return (
      <div
        className="donation-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Donation form"
      >
        {content}
      </div>
    );
  }

  return (
    <section className="donation-page">
      {content}
    </section>
  );
}

export default DonationPage;