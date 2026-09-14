import { Users, HeartHandshake, Building2, MapPinned } from "lucide-react";
const stats = [[Users, "MULTI-SECTOR DEVELOPMENT", "Healthcare · Education · Livelihoods · Environment"], [HeartHandshake, "EVIDENCE-BASED APPROACH", "Research · Baseline · M&E · Impact Assessment"], [Building2, "COLLABORATIVE DEVELOPMENT", "Government · CSR · Institutions · Communities"], [MapPinned, "COMMUNITY-CENTRIC ACTION", "Local Needs · Participation · Sustainable Solutions"]];
function Stats() { return <section className="stats-section"><div className="container stats-grid">{stats.map(([Icon, title, text]) => <div className="stat-item" key={title}><div className="stat-icon"><Icon size={25}/></div><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>; }
export default Stats;
