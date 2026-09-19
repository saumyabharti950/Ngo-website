import { ArrowRight, BriefcaseBusiness, GraduationCap, HeartPulse, Leaf } from "lucide-react";

const causes = [
  ["/images/About.png", HeartPulse, "Public Health", "Free health checkups, awareness and access to essential care.", "Healthcare"],
  ["/images/Takeaction.png", GraduationCap, "Education & Scholarship", "Learning support, school kits and digital access for children.", "Education"],
  ["/images/Getinvolbed.png", BriefcaseBusiness, "Skill Development", "Practical training that connects youth with livelihood pathways.", "Livelihood"],
  ["/images/Contact.png", Leaf, "Protection Assistance", "Sustainable communities through environment, water and safety work.", "Community"],
];

export default function Causes() {
  return (
    <section id="causes" className="bsf-causes">
      <div className="bsf-causes-shell">
        <div className="bsf-section-title">
          <span>OUR CORE CAUSES</span>
          <h2>Transforming Lives Through Core Causes</h2>
          <p>Our programmes focus on practical support, long-term dignity and measurable community outcomes.</p>
        </div>
        <div className="bsf-causes-grid">
          {causes.map(([image, Icon, title, text, tag], index) => (
            <article className="bsf-cause-card" key={title} style={{ "--d": `${index * 90}ms` }}>
              <div className="bsf-cause-image">
                <img src={image} alt={title} />
                <span><Icon size={14} /> {tag}</span>
              </div>
              <div className="bsf-cause-body">
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="/donate">Donate now <ArrowRight size={13} /></a>
              </div>
            </article>
          ))}
        </div>
        <a className="bsf-cause-main" href="/work">View all causes <ArrowRight size={14} /></a>
      </div>
      <style>{`
        .bsf-causes{ position:relative; overflow:hidden; background:linear-gradient(145deg,#101c3a 0%,#153f65 55%,#0d6245 100%); padding:92px 0; font-family:Inter,system-ui,sans-serif; color:#111b3a; }
        .bsf-causes::before{ content:""; position:absolute; inset:0; opacity:.28; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffc20f' stroke-opacity='.35' stroke-width='2'%3E%3Cpath d='M20 30h28v28H20zM94 94h34v34H94zM54 116c17-31 34-31 51 0'/%3E%3C/g%3E%3C/svg%3E"); animation:bsfCausePattern 20s linear infinite; }
        .bsf-causes-shell{ width:min(1060px, calc(100% - 34px)); margin:0 auto; }
        .bsf-section-title{ max-width:560px; margin:0 auto 34px; text-align:center; }
        .bsf-section-title span{ color:#05b36b; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
        .bsf-section-title h2{ margin:8px auto 9px; color:#fff; font-size:clamp(28px,3.5vw,42px); line-height:1.02; font-weight:900; letter-spacing:0; }
        .bsf-section-title p{ margin:0; color:rgba(255,255,255,.72); font-size:13px; line-height:1.7; }
        .bsf-causes-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        .bsf-cause-card{ border:1px solid rgba(255,255,255,.18); border-radius:8px; overflow:hidden; background:rgba(255,255,255,.94); box-shadow:0 20px 46px rgba(0,0,0,.18); opacity:0; transform:translateY(36px) scale(.97); animation:bsfCauseIn .86s cubic-bezier(.19,1,.22,1) var(--d,0s) forwards; transition:transform .28s ease, box-shadow .28s ease; }
        .bsf-cause-card:hover{ transform:translateY(-5px); box-shadow:0 22px 42px rgba(16,28,58,.12); }
        .bsf-cause-image{ position:relative; height:142px; overflow:hidden; }
        .bsf-cause-image img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .bsf-cause-card:hover img{ transform:scale(1.06); }
        .bsf-cause-image span{ position:absolute; left:10px; top:10px; display:inline-flex; align-items:center; gap:5px; padding:6px 9px; border-radius:999px; background:#ffc20f; color:#111b3a; font-size:10px; font-weight:900; }
        .bsf-cause-body{ padding:17px; }
        .bsf-cause-body h3{ margin:0 0 8px; color:#111b3a; font-size:16px; line-height:1.22; font-weight:900; letter-spacing:0; }
        .bsf-cause-body p{ min-height:62px; margin:0 0 14px; color:#667085; font-size:12px; line-height:1.62; }
        .bsf-cause-body a,.bsf-cause-main{ display:inline-flex; align-items:center; gap:6px; color:#05a365; font-size:11px; font-weight:900; text-decoration:none; }
        .bsf-cause-main{ width:max-content; margin:28px auto 0; padding:11px 18px; border-radius:999px; background:#05b36b; color:#fff; }
        @keyframes bsfCauseIn{ to{ opacity:1; transform:none; } }
        @keyframes bsfCausePattern{ to{ transform:translate3d(80px,-70px,0); } }
        @media (max-width: 980px){ .bsf-causes-grid{ grid-template-columns:repeat(2,1fr); } }
        @media (max-width: 560px){ .bsf-causes-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
