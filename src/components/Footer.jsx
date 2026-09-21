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
    <div className="footer-svg-orbit footer-svg-left" aria-hidden="true" />
    <div className="footer-svg-orbit footer-svg-right" aria-hidden="true" />
    <div className="container footer-grid">
      <section className="footer-brand">
        <a className="footer-logo brand-logo" href="/"><img src={assetUrl(footer.footer_logo || "/images/SIFI%20Foundation%20logo.png")} alt={general.website_name || "SIFI Foundation"} /></a>
        {footer.footer_content && <p>{footer.footer_content}</p>}
        <ContactDetails />
        <div className="footer-social">{Object.entries(socials).map(([name, Icon]) => safeUrl(settings.social?.[name]) && <a key={name} href={settings.social[name]} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon /></a>)}</div>
      </section>
      {footerLinks.map(({ title, links }) => <section className="footer-column" key={title}><h4>{title}</h4>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</section>)}
      <section className="footer-donate">
        <h4>Support Our Work</h4>
        <p>{settings.donation?.donation_note ?? "Your contribution helps create opportunity, dignity and sustainable change."}</p>
        <a className="btn btn-primary" href="/donate">Donate Now</a>
        <div className="footer-qr-card" aria-label="Donation QR placeholder">
          <span />
          <svg viewBox="0 0 72 72" role="img" aria-label="QR code style donation graphic">
            <path d="M6 6h20v20H6zM46 6h20v20H46zM6 46h20v20H6z" />
            <path d="M12 12h8v8h-8zM52 12h8v8h-8zM12 52h8v8h-8zM34 8h6v10h-6zM32 28h10v6H32zM48 34h6v12h-6zM32 44h8v8h-8zM44 54h8v8h-8zM58 48h8v18h-8zM34 60h6v6h-6z" />
          </svg>
        </div>
      </section>
    </div>
    <div className="container footer-trust-strip">
      {["80G Applied", "12A Registered", "CSR Ready", "Secure Donation"].map((item) => <span key={item}>{item}</span>)}
    </div>
    <div className="footer-bottom"><div className="container"><p>&copy; {new Date().getFullYear()} {general.copyright_text ?? "Social Initiative for India Foundation. All Rights Reserved."}</p><div>{safeUrl(footer.privacy_policy_url) && <a href={footer.privacy_policy_url}>Privacy Policy</a>} {safeUrl(footer.terms_url) && <a href={footer.terms_url}>Terms of Use</a>}</div></div></div>
    <style>{`
      .footer{
        position:relative;
        isolation:isolate;
        overflow:hidden;
        padding:76px 0 0;
        background:
          radial-gradient(760px circle at 20% -8%, rgba(255,194,15,.18), transparent 56%),
          radial-gradient(620px circle at 84% 18%, rgba(5,179,107,.18), transparent 58%),
          linear-gradient(180deg,#10182d 0%,#071126 100%) !important;
        color:#eaf1ff;
        border-top:6px solid #ffc20f;
        font-family:Inter,system-ui,sans-serif;
      }
      .footer::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:-2;
        opacity:.32;
        background-image:url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.22' stroke-width='2'%3E%3Cpath d='M24 38h34v34H24zM116 30h40v40h-40zM34 137c26-38 52-38 78 0s40 38 54 0'/%3E%3Ccircle cx='130' cy='120' r='18'/%3E%3C/g%3E%3C/svg%3E");
        animation:footerPatternMove 24s linear infinite;
      }
      .footer-aurora{
        position:absolute;
        z-index:-1;
        width:820px;
        height:300px;
        top:-170px;
        left:18%;
        border-radius:999px;
        background:radial-gradient(ellipse, rgba(255,194,15,.34), rgba(255,21,118,.12) 45%, transparent 72%);
        filter:blur(24px);
        animation:footerAurora 8s ease-in-out infinite alternate;
      }
      .footer-svg-orbit{
        position:absolute;
        z-index:-1;
        width:230px;
        height:230px;
        border:1px solid rgba(255,255,255,.14);
        border-radius:42px;
        background:linear-gradient(135deg, rgba(255,255,255,.08), rgba(5,179,107,.08));
        box-shadow:inset 0 0 35px rgba(255,255,255,.06);
        transform:rotate(28deg);
        animation:footerFloat 11s ease-in-out infinite;
      }
      .footer-svg-left{ left:-110px; bottom:110px; }
      .footer-svg-right{ right:-90px; top:60px; animation-delay:-4s; }
      .footer-grid{
        position:relative;
        z-index:1;
        display:grid;
        grid-template-columns:1.45fr repeat(4, minmax(120px,1fr)) 1.18fr;
        gap:24px;
        padding:34px;
        margin-bottom:18px;
        border:1px solid rgba(255,255,255,.1);
        border-radius:8px;
        background:linear-gradient(145deg, rgba(14,25,50,.94), rgba(7,17,38,.96));
        box-shadow:0 28px 70px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
      }
      .footer-grid::after{
        content:"";
        position:absolute;
        inset:14px;
        border-radius:6px;
        border:1px solid rgba(255,255,255,.05);
        pointer-events:none;
      }
      .footer-grid > section{
        opacity:0;
        transform:translateY(24px);
        animation:footerRise .85s cubic-bezier(.19,1,.22,1) forwards;
      }
      .footer-grid > section:nth-child(2){ animation-delay:.08s; }
      .footer-grid > section:nth-child(3){ animation-delay:.16s; }
      .footer-grid > section:nth-child(4){ animation-delay:.24s; }
      .footer-grid > section:nth-child(5){ animation-delay:.32s; }
      .footer-grid > section:nth-child(6){ animation-delay:.4s; }
      .footer-brand{ min-width:0; }
      .footer-logo.brand-logo{
        width:150px;
        height:auto;
        min-height:54px;
        display:flex;
        align-items:center;
        padding:8px;
        border-radius:6px;
        background:#fff;
        box-shadow:0 12px 26px rgba(0,0,0,.24);
      }
      .footer-logo.brand-logo img{
        width:134px;
        height:46px;
        object-fit:contain;
        filter:none;
      }
      .footer-brand p{
        margin:16px 0 0;
        color:#aeb9d2;
        font-size:12px;
        line-height:1.75;
      }
      .footer-address,.footer-contact{
        color:#aeb9d2;
        font-size:11px;
        line-height:1.55;
      }
      .footer-address svg,.footer-contact svg{ color:#ffc20f; }
      .footer-social{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin-top:16px;
      }
      .footer-social a{
        width:31px;
        height:31px;
        display:grid;
        place-items:center;
        border-radius:6px;
        border:1px solid rgba(255,255,255,.13);
        background:#111f3d;
        color:#fff;
        transition:transform .24s ease, background .24s ease, color .24s ease;
      }
      .footer-social a:hover{
        transform:translateY(-4px) rotate(-4deg);
        background:#ffc20f;
        color:#10182d;
      }
      .footer-column{
        display:flex;
        flex-direction:column;
        gap:10px;
      }
      .footer-column h4,.footer-donate h4{
        position:relative;
        margin:0 0 10px;
        padding-bottom:10px;
        color:#fff;
        font-size:13px;
        font-weight:900;
        letter-spacing:.2px;
      }
      .footer-column h4::after,.footer-donate h4::after{
        content:"";
        position:absolute;
        left:0;
        bottom:0;
        width:28px;
        height:3px;
        border-radius:999px;
        background:#ffc20f;
      }
      .footer-column a{
        position:relative;
        color:#aeb9d2;
        font-size:11px;
        line-height:1.45;
        transition:color .22s ease, transform .22s ease;
      }
      .footer-column a::before{
        content:"";
        position:absolute;
        left:-12px;
        top:.58em;
        width:5px;
        height:5px;
        border-radius:50%;
        background:#05b36b;
        opacity:0;
        transform:scale(.4);
        transition:.22s ease;
      }
      .footer-column a:hover{
        color:#ffc20f;
        transform:translateX(8px);
      }
      .footer-column a:hover::before{ opacity:1; transform:scale(1); }
      .footer-donate{
        position:relative;
        overflow:hidden;
        padding:18px;
        border:1px solid rgba(255,194,15,.22);
        border-radius:8px;
        background:linear-gradient(145deg, rgba(255,194,15,.13), rgba(5,179,107,.08));
      }
      .footer-donate::before{
        content:"";
        position:absolute;
        right:-42px;
        bottom:-52px;
        width:130px;
        height:130px;
        border-radius:34px;
        background:#ffc20f;
        opacity:.13;
        transform:rotate(20deg);
      }
      .footer-donate p{
        position:relative;
        margin:0 0 14px;
        color:#c4cce0;
        font-size:11px;
        line-height:1.6;
      }
      .footer-donate .btn{
        position:relative;
        min-height:34px;
        padding:0 14px;
        border-radius:6px;
        background:#ffc20f;
        color:#10182d;
        font-size:11px;
        font-weight:900;
        box-shadow:0 12px 24px rgba(255,194,15,.18);
      }
      .footer-qr-card{
        position:relative;
        display:flex;
        align-items:center;
        gap:10px;
        margin-top:16px;
        padding:10px;
        border-radius:7px;
        background:#081226;
        border:1px solid rgba(255,255,255,.1);
      }
      .footer-qr-card span{
        width:7px;
        height:46px;
        border-radius:999px;
        background:linear-gradient(#ffc20f,#05b36b);
      }
      .footer-qr-card svg{
        width:58px;
        height:58px;
        padding:6px;
        border-radius:5px;
        background:#fff;
        fill:#10182d;
      }
      .footer-trust-strip{
        position:relative;
        z-index:1;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:10px;
        margin-bottom:18px;
        padding:12px;
        border-radius:8px;
        background:#0b152c;
        border:1px solid rgba(255,255,255,.08);
      }
      .footer-trust-strip span{
        min-height:34px;
        display:grid;
        place-items:center;
        border-radius:6px;
        color:#b9c3d8;
        background:#111f3d;
        font-size:10px;
        font-weight:900;
        letter-spacing:.5px;
        text-transform:uppercase;
      }
      .footer-bottom{
        position:relative;
        z-index:1;
        padding:15px 0;
        border-top:1px solid rgba(255,255,255,.08);
        background:#070f20;
        color:#8894ad;
        font-size:10px;
      }
      .footer-bottom .container{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:20px;
      }
      .footer-bottom a{ color:#ffc20f; margin-left:12px; }
      @keyframes footerRise{ to{ opacity:1; transform:none; } }
      @keyframes footerAurora{ to{ transform:translateX(12%) scale(1.12); opacity:.82; } }
      @keyframes footerFloat{ 50%{ transform:rotate(38deg) translate(18px,-16px); } }
      @keyframes footerPatternMove{ to{ transform:translate3d(-90px,70px,0); } }
      @media (max-width: 1100px){
        .footer-grid{ grid-template-columns:1.4fr repeat(2,1fr); }
        .footer-donate{ grid-column:span 2; }
      }
      @media (max-width: 700px){
        .footer{ padding-top:54px; }
        .footer-grid{ grid-template-columns:1fr; padding:24px; }
        .footer-donate{ grid-column:auto; }
        .footer-trust-strip{ grid-template-columns:1fr 1fr; }
        .footer-bottom .container{ flex-direction:column; text-align:center; }
      }
      @media (prefers-reduced-motion: reduce){
        .footer,.footer *,.footer::before{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; }
      }
    `}</style>
  </footer>;
}
export default Footer;
