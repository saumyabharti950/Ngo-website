import { Building2, HeartHandshake, IndianRupee, UsersRound } from "lucide-react";

const stats = [
  [IndianRupee, "5 Cr+", "Funds mobilised"],
  [HeartHandshake, "1 Cr+", "Meals & support"],
  [UsersRound, "500,000+", "People reached"],
  [Building2, "1000+", "Communities touched"],
];

export default function Stats() {
  return (
    <section className="bsf-stats">
      <div className="bsf-stats-shell">
        {stats.map(([Icon, value, label]) => (
          <article className="bsf-stat" key={label}>
            <Icon size={22} />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </article>
        ))}
        <a href="/donate" className="bsf-stat-donate">Donate now</a>
      </div>
      <style>{`
        .bsf-stats{ background:#fff; border-bottom:1px solid #edf0f5; font-family:Inter,system-ui,sans-serif; }
        .bsf-stats-shell{ width:min(1060px, calc(100% - 34px)); margin:0 auto; min-height:70px; display:grid; grid-template-columns:repeat(4,1fr) auto; align-items:center; gap:14px; padding:12px 0; }
        .bsf-stat{ display:flex; align-items:center; gap:12px; min-width:0; padding:5px 14px; border-left:3px solid #05b36b; }
        .bsf-stat svg{ color:#05b36b; flex:none; }
        .bsf-stat strong{ display:block; color:#111b3a; font-size:22px; line-height:1; font-weight:900; letter-spacing:0; }
        .bsf-stat span{ display:block; margin-top:3px; color:#667085; font-size:11px; font-weight:800; }
        .bsf-stat-donate{ display:inline-flex; align-items:center; justify-content:center; min-height:36px; padding:0 18px; border-radius:999px; background:#05b36b; color:#fff; font-size:12px; font-weight:900; text-decoration:none; box-shadow:0 12px 22px rgba(5,179,107,.22); transition:transform .25s ease; }
        .bsf-stat-donate:hover{ transform:translateY(-2px); }
        @media (max-width: 900px){ .bsf-stats-shell{ grid-template-columns:repeat(2,1fr); }.bsf-stat-donate{ grid-column:1/-1; } }
        @media (max-width: 520px){ .bsf-stats-shell{ grid-template-columns:1fr; }.bsf-stat{ border-left-width:2px; } }
      `}</style>
    </section>
  );
}
