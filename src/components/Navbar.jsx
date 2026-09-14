import { useState } from "react";
import { ArrowRight, ChevronDown, HeartHandshake, Languages, Menu, X } from "lucide-react";

const navigation = [
  { href: "/", label: "Home" }, { href: "/about-us", label: "About Us" },
  { href: "/take-action", label: "Take Action", items: [["/campaigns", "Campaigns"], ["/volunteer", "Volunteer with us"], ["/donate", "Donate"]] },
  { href: "/work", label: "Our Work", items: [["/work", "Programmes"], ["/impact-stories", "Impact stories"], ["/gallery", "Gallery"]] },
  { href: "/impact-stories", label: "Impact Stories" }, { href: "/get-involved", label: "Get Involved" }, { href: "/blog", label: "Blog" }, { href: "/contact", label: "Contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const closeMenu = () => setMobileOpen(false);
  return <header className="navbar"><div className="container navbar-container">
    <a className="logo brand-logo" href="/" aria-label="SIFI Foundation home" onClick={closeMenu}><img src="/images/SIFI%20Foundation%20logo.png" alt="SIFI Foundation" /></a>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map((item) => item.items ? <div className="nav-dropdown" key={item.label}><a href={item.href}>{item.label} <ChevronDown size={14} aria-hidden="true" /></a><div className="nav-dropdown-panel">{item.items.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div></div> : <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    <div className="nav-actions"><label className="language-select" aria-label="Select language"><Languages size={15} aria-hidden="true" /><select value={language} onChange={(event) => { setLanguage(event.target.value); document.documentElement.lang = event.target.value; }} aria-label="Select language"><option value="en">English</option><option value="hi">हिन्दी</option></select></label><a className="btn btn-primary nav-donate" href="/donate"><HeartHandshake size={16} />Donate <ArrowRight size={16} /></a><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={25} /> : <Menu size={25} />}</button></div>
  </div>{mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map((item) => <div key={item.label} className="mobile-nav-group"><a href={item.href} onClick={closeMenu}>{item.label}</a>{item.items?.map(([href, label]) => <a className="mobile-sub-link" key={href} href={href} onClick={closeMenu}>{label}</a>)}</div>)}<a className="mobile-donate" href="/donate" onClick={closeMenu}>Donate</a></nav>}</header>;
}

export default Navbar;
