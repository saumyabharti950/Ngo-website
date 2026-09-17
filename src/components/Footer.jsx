import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter, FaWhatsapp, FaTelegram } from "react-icons/fa6";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { assetUrl } from "../lib/api";
import { safeUrl } from "../../shared/settings";
import ContactDetails from "./ContactDetails";
const socials = { facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedinIn, youtube: FaYoutube, twitter: FaXTwitter, whatsapp: FaWhatsapp, telegram: FaTelegram };
const footerLinks = [
  { title: "About Us", links: [["About SIFI Foundation", "/about-us"], ["Vision & Mission", "/about-us"], ["Leadership", "/credentials"], ["Governance", "/credentials"]] },
  { title: "Initiatives", links: [["Healthcare & Public Health", "/work"], ["Education & Digital Learning", "/work"], ["Skills & Livelihoods", "/work"], ["Environment & Climate", "/work"]] },
  { title: "Important Links", links: [["Impact Stories", "/impact-stories"], ["Volunteer With Us", "/volunteer"], ["Campaigns", "/campaigns"], ["Policies & Resources", "/credentials"]] },
  { title: "Explore More", links: [["Gallery", "/gallery"], ["Research & Knowledge", "/work"], ["Partner With Us", "/reach"], ["Contact Us", "/reach"]] },
];


function Footer() {
  const { settings } = useSiteSettings();
  const footer = settings.footer || {};
  const general = settings.general || {};
  return <footer className="footer">
    <div className="footer-aurora" aria-hidden="true" />
    <div className="container footer-grid">
      <section className="footer-brand">
        <a className="footer-logo brand-logo" href="/"><img src={assetUrl(footer.footer_logo || "/images/SIFI%20Foundation%20logo.png")} alt={general.website_name || "SIFI Foundation"} /></a>
        {footer.footer_content && <p>{footer.footer_content}</p>}
        <ContactDetails />
        <div className="footer-social">{Object.entries(socials).map(([name, Icon]) => safeUrl(settings.social?.[name]) && <a key={name} href={settings.social[name]} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon /></a>)}</div>
      </section>
      {footerLinks.map(({ title, links }) => <section className="footer-column" key={title}><h4>{title}</h4>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</section>)}
      <section className="footer-donate"><h4>Support Our Work</h4><p>{settings.donation?.donation_note ?? "Your contribution helps create opportunity, dignity and sustainable change."}</p><a className="btn btn-primary" href="/donate">Donate Now</a></section>
    </div>
    <div className="footer-bottom"><div className="container"><p>&copy; {new Date().getFullYear()} {general.copyright_text ?? "Social Initiative for India Foundation. All Rights Reserved."}</p><div>{safeUrl(footer.privacy_policy_url) && <a href={footer.privacy_policy_url}>Privacy Policy</a>} {safeUrl(footer.terms_url) && <a href={footer.terms_url}>Terms of Use</a>}</div></div></div>
  </footer>;
}
export default Footer;
