import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/sififoundation", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/sififoundation", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sifi-foundation", Icon: FaLinkedinIn },
  { label: "YouTube", href: "https://www.youtube.com/@sififoundation", Icon: FaYoutube },
];

const footerLinks = [
  { title: "About Us", links: [["About SIFI Foundation", "/about-us"], ["Vision & Mission", "/about-us"], ["Leadership", "/credentials"], ["Governance", "/credentials"]] },
  { title: "Initiatives", links: [["Healthcare & Public Health", "/work"], ["Education & Digital Learning", "/work"], ["Skills & Livelihoods", "/work"], ["Environment & Climate", "/work"]] },
  { title: "Important Links", links: [["Impact Stories", "/impact-stories"], ["Volunteer With Us", "/volunteer"], ["Campaigns", "/campaigns"], ["Policies & Resources", "/credentials"]] },
  { title: "Explore More", links: [["Gallery", "/gallery"], ["Research & Knowledge", "/work"], ["Partner With Us", "/reach"], ["Contact Us", "/reach"]] },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-aurora" aria-hidden="true" />
      <div className="footer-prism prism-left" aria-hidden="true" />
      <div className="footer-prism prism-right" aria-hidden="true" />
      <div className="container footer-grid">
        <section className="footer-brand">
          <a className="footer-logo brand-logo" href="/" aria-label="SIFI Foundation home"><img src="/images/SIFI%20Foundation%20logo.png" alt="SIFI Foundation" /></a>
          <div className="footer-address"><MapPin size={16}/><span>C/22, Patel Park, Harmu Housing Colony,<br/>Ranchi – 834002, Jharkhand, India</span></div>
          <a className="footer-contact" href="mailto:info@sififoundation.org"><Mail size={16}/> info@sififoundation.org</a>
          <a className="footer-contact" href="tel:06513591618"><Phone size={16}/> 0651-3591618</a>
          <div className="footer-social">{socialLinks.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow SIFI Foundation on ${label}`} title={label}><Icon aria-hidden="true" /></a>)}</div>
        </section>

        {footerLinks.map(({ title, links }) => <section className="footer-column" key={title}><h4>{title}</h4>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</section>)}

        <section className="footer-donate">
          <h4>Support Our Work</h4>
          <p>Your contribution helps create opportunity, dignity and sustainable change.</p>
          <a className="btn btn-primary" href="/donate">Donate Now</a>
          <span>For donation assistance</span>
          <a href="mailto:projects@sififoundation.org">projects@sififoundation.org</a>
        </section>
      </div>
      <div className="footer-bottom"><div className="container"><p>© {new Date().getFullYear()} Social Initiative for India Foundation. All Rights Reserved.</p><p>A Section 8 Not-for-Profit Organisation</p></div></div>
    </footer>
  );
}

export default Footer;
