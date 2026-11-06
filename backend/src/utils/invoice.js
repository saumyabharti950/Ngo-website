import PDFDocument from "pdfkit";
import { Setting } from "../models/index.js";

const settingMap = async () => {
  const rows = await Setting.findAll();
  return Object.fromEntries(rows.map((row) => [`${row.group}.${row.key}`, row.value]));
};

export async function streamDonationInvoice(res, donation) {
  const settings = await settingMap();
  const doc = new PDFDocument({ margin: 48 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=donation-${donation.donationNumber || donation.id}.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text(settings["general.website_name"] || "SIFI Foundation", { align: "center" });
  doc.moveDown(0.5).fontSize(10).text(settings["contact.address"] || "Ranchi, Jharkhand, India", { align: "center" });
  doc.text(`${settings["contact.primary_email"] || "info@sififoundation.org"} | ${settings["contact.phone"] || "0651-3591618"}`, { align: "center" });
  doc.moveDown(2).fontSize(16).text("Donation Receipt & 80G Tax Exemption Certificate");
  doc.moveDown().fontSize(11);
  [
    ["Receipt Number", donation.receiptNumber || `SIFI-${donation.id}`],
    ["Donation Number", donation.donationNumber || "-"],
    ["Transaction ID", donation.transactionUuid],
    ["Payment Gateway", donation.gateway],
    ["Payment ID", donation.gatewayPaymentId || donation.razorpayPaymentId || "-"],
    ["Date", donation.paidAt ? new Date(donation.paidAt).toLocaleString("en-IN") : new Date(donation.createdAt).toLocaleString("en-IN")],
    ["Donor Name", donation.donorName || donation.User?.name || "Anonymous Donor"],
    ["Email", donation.email || donation.User?.email || "-"],
    ["Phone", donation.phone || "-"],
    ["PAN Number", donation.panNumber || "Not Provided"],
    ["Address", [donation.address, donation.city, donation.state, donation.country, donation.pincode].filter(Boolean).join(", ") || "-"],
    ["Amount", `${donation.currency || "INR"} ${donation.amount}`],
    ["Payment Method", donation.paymentMethod || "-"],
    ["Purpose", donation.message || "General Healthcare & Welfare"],
    ["Status", donation.status === "captured" ? "Successful (Paid)" : donation.status]
  ].forEach(([label, value]) => doc.text(`${label}: ${value || "-"}`));
  doc.moveDown(2).fontSize(12).text("All donations are eligible for tax benefit under Section 80G / 13A of Income Tax Act 1961.");
  doc.moveDown(1).fontSize(13).text("Thank you for your generous contribution!");
  doc.end();
}
