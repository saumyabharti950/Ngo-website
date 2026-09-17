import { useState } from "react";
import { ArrowRight, ChevronDown, HeartHandshake, Languages, LogOut, Menu, UserRound, X, Mail, Phone, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { assetUrl } from "../lib/api";
import { safeUrl } from "../../shared/settings";
import './Navbar.css';

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/take-action", label: "Take Action", items: [["/campaigns", "Campaigns"], ["/volunteer", "Volunteer with us"], ["/donate", "Donate"]] },
  { href: "/work", label: "Our Work", items: [["/programmes", "Programmes"], ["/impact-stories", "Impact stories"], ["/gallery", "Gallery"]] },
  { href: "/impact-stories", label: "Impact Stories" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

function Navbar({ preview = false, path = '/' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const header = settings.header || {};
  const name = settings.general?.website_name || "SIFI Foundation";
  const closeMenu = () => setMobileOpen(false);
  const blockPreview = (event) => { if (preview) event.preventDefault(); };
  const isCurrent = href => href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

  return (
    <header className="navbar polished-navbar" onKeyDown={event => { if (event.key === 'Escape') { closeMenu(); event.currentTarget.querySelector('.mobile-menu')?.focus(); } }}>
      {(header.announcement_status === "active" || header.header_phone || header.header_email) && <div className="site-announcement">
        <div className="container nav-utility-inner"><span className="nav-purpose"><Sparkles size={12}/>{header.announcement_status === "active" ? header.announcement_text : 'Creating opportunities. Strengthening communities.'}</span><div className="nav-utility-contact">
        {header.header_phone && <a href={`tel:${header.header_phone}`}><Phone size={12}/>{header.header_phone}</a>}
        {header.header_email && <a href={`mailto:${header.header_email}`}><Mail size={12}/>{header.header_email}</a>}
        </div></div>
      </div>}
      <div className="container navbar-container">
        <a className="logo brand-logo" href="/" aria-label={`${name} home`} onClick={(event) => { blockPreview(event); closeMenu(); }}>
          <span className="nav-logo-plaque">
          <img src={assetUrl(header.header_logo || "/images/SIFI%20Foundation%20logo.png")} alt={name} />
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => item.items ? (
            <div className={`nav-dropdown ${isCurrent(item.href) || item.items.some(([href]) => isCurrent(href)) ? 'nav-group-active' : ''}`} key={item.label}>
              <a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label} <ChevronDown size={12} aria-hidden="true" /></a>
              <div className="nav-dropdown-panel">{item.items.map(([href, label]) => <a key={href} href={href} aria-current={isCurrent(href) ? 'page' : undefined}>{label}<ArrowRight size={14}/></a>)}</div>
            </div>
          ) : <a key={item.href} href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a>)}
        </nav>
        <div className="nav-actions">
          <label className="language-select" aria-label="Select language">
            <Languages size={15} aria-hidden="true" />
            <select value={language} onChange={(event) => { setLanguage(event.target.value); document.documentElement.lang = event.target.value; }} aria-label="Select language">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </label>
          <a className="btn btn-primary nav-donate" href={safeUrl(header.header_button_url) || "/donate"}><HeartHandshake size={16} />{header.header_button_text ?? "Donate"} <ArrowRight size={16} /></a>
          {user ? (
            <div className="profile-menu">
              <button type="button"><UserRound size={16} />{user.name}<ChevronDown size={14} /></button>
              <div>
                <a href="/admin">Dashboard</a>
                <a href="/admin/profile">Profile</a>
                <button type="button" onClick={logout}><LogOut size={15} />Logout</button>
              </div>
            </div>
          ) : <a className="nav-login" href="/login"><UserRound size={16}/><span>Login</span></a>}
          <button type="button" className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <div key={item.label} className="mobile-nav-group">
              <a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined} onClick={closeMenu}>{item.label}</a>
              {item.items?.map(([href, label]) => <a className="mobile-sub-link" key={href} href={href} onClick={closeMenu}>{label}</a>)}
            </div>
          ))}
          {user ? (
            <>
              <a href="/admin" onClick={closeMenu}>Dashboard</a>
              <button type="button" onClick={() => { closeMenu(); logout(); }}>Logout</button>
            </>
          ) : <a href="/login" onClick={closeMenu}>Login</a>}
          <a className="mobile-donate" href={safeUrl(header.header_button_url) || "/donate"} onClick={closeMenu}>{header.header_button_text ?? "Donate"}</a>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
