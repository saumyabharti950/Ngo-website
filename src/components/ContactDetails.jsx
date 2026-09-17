import { useSiteSettings } from "../context/SiteSettingsContext";

export default function ContactDetails() {
  const { settings } = useSiteSettings();
  const contact = settings.contact || {};
  const address = [contact.address, contact.city, contact.state, contact.country, contact.pincode].filter(Boolean).join(", ");
  return <address className="site-contact-details">
    <strong>{settings.general?.website_name ?? "SIFI Foundation"}</strong>
    <span>{address || (contact.address == null ? "C/22, Patel Park, Harmu Housing Colony, Ranchi, Jharkhand, India" : "")}</span>
    {[contact.primary_email ?? "info@sififoundation.org", contact.alternate_email].filter(Boolean).map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}
    {[contact.phone ?? "0651-3591618", contact.alternate_phone].filter(Boolean).map((phone) => <a key={phone} href={`tel:${phone}`}>{phone}</a>)}
    {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}>WhatsApp: {contact.whatsapp}</a>}
    {contact.office_hours && <span>Office hours: {contact.office_hours}</span>}
    {contact.latitude && contact.longitude && <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${contact.latitude},${contact.longitude}`)}`} target="_blank" rel="noreferrer">View location on map</a>}
  </address>;
}
