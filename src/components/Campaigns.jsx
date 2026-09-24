import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Heart, Utensils } from "lucide-react";

const campaignTabs = ["All", "Child Education", "Health", "Food", "Women", "Emergency"];

const campaignItems = [
  ["Child Education", "/images/Takeaction.png", "Sponsor School Essentials For Children", "Education kits, books and learning support for children who need a stronger start.", "Support now", 74],
  ["Child Education", "/images/digital-learning-corners.jpg", "Digital Learning Corners", "Help set up guided digital learning spaces with tablets, worksheets and mentor support.", "Sponsor learning", 66],
  ["Child Education", "/images/about1.png", "Back To School Bridge Classes", "Support children who need remedial lessons, reading practice and confidence after learning gaps.", "Help children", 82],
  ["Health", "/images/About.png", "Serve A Day, Serve A Dream", "Help field teams deliver health awareness, basic screenings and care in local communities.", "Join campaign", 72],
  ["Health", "/images/mobile-health-camp-support.jpg", "Mobile Health Camp Support", "Contribute to community checkups, doctor consultations and follow-up guidance for families.", "Support care", 68],
  ["Health", "/images/about2.png", "Nutrition And Wellness Drive", "Back practical nutrition counselling, hygiene awareness and family health sessions.", "Donate today", 79],
  ["Food", "/images/community-meal-support.png", "Community Meal Support", "Provide nutritious meals and grocery support for children, elders and vulnerable households.", "Feed families", 85],
  ["Food", "/images/festival-food-kits.png", "Festival Food Kits", "Help distribute essential ration kits during high-need seasons and community drives.", "Sponsor kits", 63],
  ["Food", "/images/cover.png", "No Child Sleeps Hungry", "Support emergency meal response for children and families facing food insecurity.", "Give meals", 91],
  ["Women", "/images/Getinvolbed.png", "Women's Skill Circles", "Fund practical training, mentoring and basic livelihood tools for women-led progress.", "Empower women", 71],
  ["Women", "/images/health-rights-confidence.png", "Health, Rights And Confidence", "Support awareness meetings on health, dignity, safety and financial literacy.", "Stand with her", 69],
  ["Women", "/images/about3.png", "Micro Enterprise Starter Support", "Help women start small income activities through training, guidance and starter material.", "Start change", 76],
  ["Emergency", "/images/Contact.png", "First Aid And Care Children Help", "Back emergency support, healthcare access and dignity-first community care.", "Donate today", 78],
  ["Emergency", "/images/relief-for-elderly-families.png", "Relief For Elderly Families", "Support urgent assistance, food, medicine and care coordination for elderly community members.", "Send relief", 65],
  ["Emergency", "/images/Blog.png", "Rapid Response Community Fund", "Create a flexible support pool for urgent field needs, local crises and immediate outreach.", "Respond now", 88],
];

export default function Campaigns({ fullPage = false }) {
  const [activeTab, setActiveTab] = useState("All");
  const visibleCampaigns = useMemo(() => {
    const items = activeTab === "All" ? campaignItems : campaignItems.filter(([category]) => category === activeTab);
    return fullPage ? items : items.slice(0, 3);
  }, [activeTab, fullPage]);

  return (
    <section id="campaigns" className={`bsf-campaigns ${fullPage ? "bsf-campaigns-page" : ""}`}>
      <div className="bsf-campaign-shell">
        {fullPage && (
          <div className="bsf-campaign-heading">
            <span>ACTIVE CAMPAIGNS</span>
            <h1>Choose a campaign and create direct community impact.</h1>
            <p>Every category has focused campaigns with clear purpose, practical action and transparent giving.</p>
          </div>
        )}
        <div className="bsf-filter-row" aria-label="Campaign categories">
          {campaignTabs.map((item) => (
            <button className={activeTab === item ? "active" : ""} type="button" key={item} onClick={() => setActiveTab(item)}>{item}</button>
          ))}
        </div>
        <div className="bsf-campaign-grid">
          {visibleCampaigns.map(([category, image, title, text, cta, progress], index) => (
            <article className="bsf-campaign-card" style={{ "--d": `${index * 90}ms` }} key={title}>
              <div className="bsf-campaign-media">
                <img className={title === "Festival Food Kits" ? "bsf-campaign-image-contain" : ""} src={image} alt={title} />
                <span><Heart size={12} fill="currentColor" /> {category}</span>
              </div>
              <div className="bsf-campaign-body">
                <div className="bsf-campaign-meta"><CalendarDays size={13} /> Ongoing campaign</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="bsf-progress"><i style={{ width: `${progress}%` }} /></div>
                <div className="bsf-campaign-foot">
                  <span><Utensils size={13} /> Community fund</span>
                  <a href="/donate">{cta} <ArrowRight size={13} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!fullPage && <a className="bsf-view-more" href="/campaigns">Explore all active campaigns <ArrowRight size={15} /></a>}
      </div>
      <style>{`
        .bsf-campaigns{ position:relative; overflow:hidden; background:linear-gradient(135deg,#f1f7ff 0%,#fff7d9 48%,#eafff3 100%); padding:42px 0 78px; font-family:Inter,system-ui,sans-serif; color:#111b3a; }
        .bsf-campaigns-page{ padding:86px 0 96px; min-height:calc(100vh - 120px); }
        .bsf-campaigns::before{ content:""; position:absolute; inset:0; pointer-events:none; opacity:.42; background:url("data:image/svg+xml,%3Csvg width='180' height='140' viewBox='0 0 180 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ff1576' stroke-opacity='.12' stroke-width='3'%3E%3Cpath d='M10 118C40 30 70 30 100 118s58 88 70 0'/%3E%3Ccircle cx='132' cy='36' r='19'/%3E%3C/g%3E%3C/svg%3E"); animation:bsfCampaignPattern 18s linear infinite; }
        .bsf-campaign-shell{ position:relative; z-index:1; width:min(1060px, calc(100% - 34px)); margin:0 auto; }
        .bsf-campaigns-page .bsf-campaign-shell{ width:min(1160px, calc(100% - 34px)); }
        .bsf-campaign-heading{ max-width:720px; margin:0 auto 30px; text-align:center; }
        .bsf-campaign-heading span{ color:#05b36b; font-size:11px; font-weight:900; letter-spacing:1.2px; text-transform:uppercase; }
        .bsf-campaign-heading h1{ margin:9px 0 12px; color:#111b3a; font-size:clamp(34px,4.4vw,58px); line-height:1; font-weight:900; letter-spacing:0; }
        .bsf-campaign-heading p{ margin:0 auto; max-width:620px; color:#667085; font-size:14px; line-height:1.75; }
        .bsf-filter-row{ display:flex; justify-content:center; gap:9px; flex-wrap:wrap; margin-bottom:24px; }
        .bsf-filter-row button{ min-height:31px; padding:0 14px; border:1px solid #e3e7ef; border-radius:999px; background:#fff; color:#677083; font-size:11px; font-weight:900; cursor:pointer; transition:.22s ease; }
        .bsf-filter-row button.active,.bsf-filter-row button:hover{ background:#ffc20f; border-color:#ffc20f; color:#111b3a; transform:translateY(-1px); }
        .bsf-campaign-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .bsf-campaigns-page .bsf-campaign-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); }
        .bsf-campaign-card{ overflow:hidden; border-radius:8px; border:1px solid rgba(255,255,255,.74); background:rgba(255,255,255,.9); box-shadow:0 18px 42px rgba(16,28,58,.1); opacity:0; transform:translateY(34px) rotateX(5deg); animation:bsfCampaignIn .9s cubic-bezier(.19,1,.22,1) var(--d,0s) forwards; transition:transform .28s ease, box-shadow .28s ease; backdrop-filter:blur(10px); }
        .bsf-campaign-card:hover{ transform:translateY(-5px); box-shadow:0 22px 42px rgba(16,28,58,.14); }
        .bsf-campaign-media{ position:relative; height:170px; overflow:hidden; background:#fff; }
        .bsf-campaign-media img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .55s ease; }
        .bsf-campaign-media img.bsf-campaign-image-contain{ object-fit:contain; background:#fff; }
        .bsf-campaign-card:hover img{ transform:scale(1.06); }
        .bsf-campaign-media span{ position:absolute; top:12px; right:12px; display:inline-flex; align-items:center; gap:5px; padding:6px 9px; border-radius:999px; background:#05b36b; color:#fff; font-size:10px; font-weight:900; }
        .bsf-campaign-body{ padding:18px; }
        .bsf-campaign-meta{ display:flex; align-items:center; gap:6px; color:#05b36b; font-size:11px; font-weight:900; margin-bottom:10px; }
        .bsf-campaign-card h3{ margin:0 0 8px; color:#111b3a; font-size:17px; line-height:1.25; font-weight:900; letter-spacing:0; }
        .bsf-campaign-card p{ margin:0; color:#667085; font-size:12px; line-height:1.6; min-height:58px; }
        .bsf-progress{ height:6px; border-radius:999px; background:#edf0f5; margin:16px 0 13px; overflow:hidden; }
        .bsf-progress i{ display:block; height:100%; border-radius:inherit; background:#ff1576; }
        .bsf-campaign-foot{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .bsf-campaign-foot span{ display:inline-flex; align-items:center; gap:5px; color:#8a93a5; font-size:10px; font-weight:800; }
        .bsf-campaign-foot a,.bsf-view-more{ display:inline-flex; align-items:center; gap:5px; color:#111b3a; font-size:11px; font-weight:900; text-decoration:none; }
        .bsf-campaign-foot a{ color:#ff1576; }
        .bsf-view-more{ width:max-content; margin:26px auto 0; padding:10px 16px; border-radius:999px; background:#fff; border:1px solid #e3e7ef; }
        @keyframes bsfCampaignIn{ to{ opacity:1; transform:none; } }
        @keyframes bsfCampaignPattern{ to{ transform:translate3d(-90px,40px,0); } }
        @media (max-width: 980px){ .bsf-campaigns-page .bsf-campaign-grid{ grid-template-columns:repeat(2,1fr); } }
        @media (max-width: 860px){ .bsf-campaign-grid{ grid-template-columns:1fr; max-width:430px; margin:0 auto; }.bsf-campaigns-page .bsf-campaign-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
