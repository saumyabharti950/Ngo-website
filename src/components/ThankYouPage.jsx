import { useEffect, useState } from "react";
import { CheckCircle2, Download, Heart, ArrowRight, Home, AlertCircle, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function ThankYouPage() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const donationId = params.get("donation_id");
    const orderId = params.get("order_id") || params.get("razorpay_order_id");
    const checkout = params.get("checkout");

    if (!donationId && !orderId) {
      setLoading(false);
      setError("No donation reference found in this URL. If you completed a payment, please check your email or contact support.");
      return;
    }

    let isMounted = true;

    async function loadAndVerify() {
      try {
        setLoading(true);
        setError("");

        // If returned from gateway checkout, verify payment status
        if (checkout === "return" || orderId) {
          try {
            await api("/donations/verify", {
              method: "POST",
              body: {
                donationId: donationId || undefined,
                razorpay_order_id: orderId || undefined
              }
            });
          } catch (verifyErr) {
            console.warn("Verification notice:", verifyErr.message);
          }
        }

        // Fetch detailed donation record
        const identifier = donationId || orderId;
        const data = await api(`/donations/details/${identifier}`);
        if (isMounted) {
          setDonation(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to retrieve donation details. Your payment might still be processing.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAndVerify();

    return () => {
      isMounted = false;
    };
  }, []);

  const downloadReceipt = async () => {
    if (!donation) return;
    try {
      setDownloading(true);
      const identifier = donation.donationNumber || donation.id;
      const response = await api(`/donations/${identifier}/invoice`, { raw: true });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Donation-Receipt-${donation.donationNumber || donation.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Receipt download failed: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const orgName = settings?.general?.website_name || "SIFI Foundation";

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        {loading ? (
          <div className="thank-you-card loading-state">
            <div className="spinner" />
            <h2>Verifying Your Donation...</h2>
            <p>Please wait while we confirm your payment and generate your official receipt.</p>
          </div>
        ) : error && !donation ? (
          <div className="thank-you-card error-state">
            <div className="status-icon error-icon">
              <AlertCircle size={48} />
            </div>
            <h2>Notice Regarding Your Payment</h2>
            <p className="error-description">{error}</p>
            <div className="thank-you-actions">
              <a href="/donate" className="btn btn-primary">
                Try Donation Again <ArrowRight size={16} />
              </a>
              <a href="/" className="btn btn-secondary">
                <Home size={16} /> Back to Homepage
              </a>
            </div>
          </div>
        ) : (
          <div className="thank-you-card success-state">
            <div className="thank-you-header">
              <div className="success-badge">
                <CheckCircle2 size={54} className="icon-success" />
              </div>
              <span className="celebration-tag">
                <Heart size={14} fill="currentColor" /> Payment Received Successfully
              </span>
              <h1>Thank You, {donation?.donorName || "Generous Donor"}!</h1>
              <p className="thank-you-subtitle">
                Your support makes a profound difference. Every contribution enables {orgName} to bring healthcare, nutrition, and dignity to vulnerable communities.
              </p>
            </div>

            <div className="receipt-box">
              <div className="receipt-box-head">
                <div>
                  <span className="receipt-label">Donation Reference No.</span>
                  <strong className="receipt-number">{donation?.donationNumber || donation?.receiptNumber || `SIFI-${donation?.id}`}</strong>
                </div>
                <div className="receipt-status-pill">
                  <ShieldCheck size={16} /> {donation?.status === "captured" ? "Confirmed / Paid" : "Processing"}
                </div>
              </div>

              <div className="receipt-details-grid">
                <div className="receipt-item">
                  <span className="item-label">Amount Donated</span>
                  <span className="item-value amount-highlight">₹{Number(donation?.amount || 0).toLocaleString("en-IN")}</span>
                </div>

                <div className="receipt-item">
                  <span className="item-label">Cause / Purpose</span>
                  <span className="item-value">{donation?.message || "Healthcare & General Welfare"}</span>
                </div>

                <div className="receipt-item">
                  <span className="item-label">Date & Time</span>
                  <span className="item-value">
                    {donation?.paidAt
                      ? new Date(donation.paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                      : donation?.createdAt
                        ? new Date(donation.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                        : "-"}
                  </span>
                </div>

                <div className="receipt-item">
                  <span className="item-label">Payment Gateway</span>
                  <span className="item-value text-capitalize">
                    {donation?.gateway === "cashfree" ? "Cashfree Payments" : donation?.gateway === "razorpay" ? "Razorpay" : donation?.gateway || "Online"}
                  </span>
                </div>

                <div className="receipt-item">
                  <span className="item-label">Donor Name</span>
                  <span className="item-value">{donation?.donorName || "-"}</span>
                </div>

                <div className="receipt-item">
                  <span className="item-label">Email Address</span>
                  <span className="item-value">{donation?.email || "-"}</span>
                </div>

                {donation?.phone && (
                  <div className="receipt-item">
                    <span className="item-label">Mobile Number</span>
                    <span className="item-value">{donation.phone}</span>
                  </div>
                )}

                {donation?.panNumber && (
                  <div className="receipt-item">
                    <span className="item-label">PAN (For 80G Tax Exemption)</span>
                    <span className="item-value font-mono">{donation.panNumber}</span>
                  </div>
                )}
              </div>

              {donation?.panNumber && (
                <div className="tax-exemption-note">
                  <p>
                    <strong>80G Tax Exemption:</strong> This receipt is eligible for 50% deduction under Section 80G / 13A of the Indian Income Tax Act.
                  </p>
                </div>
              )}
            </div>

            <div className="thank-you-actions">
              <button
                type="button"
                className="btn btn-primary download-receipt-btn"
                onClick={downloadReceipt}
                disabled={downloading}
              >
                <Download size={18} />
                {downloading ? "Preparing Receipt..." : "Download Official 80G Receipt (PDF)"}
              </button>

              <a href="/donate" className="btn btn-outline">
                <Heart size={16} /> Make Another Donation
              </a>

              <a href="/" className="btn btn-secondary">
                <Home size={16} /> Back to Homepage
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
