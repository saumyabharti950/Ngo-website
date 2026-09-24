import { ContentCards, usePublishedContent } from "./PublishedContent";
import ContactDetails from "./ContactDetails";
import ContentDetailView from "./ContentDetailView";
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import ContentCollection, { collectionThemes } from "./ContentCollection";
import Campaigns from "./Campaigns";

/* =========================================================================
   CONTENT
   ========================================================================= */

const pages = {
  "/about-us": {
    label: "ABOUT SIFI FOUNDATION", title: "Building Pathways to Inclusive and Sustainable Development",
    text: "Social Initiative for India Foundation (SIFI Foundation) is a Section 8 not-for-profit organisation committed to advancing inclusive, sustainable and community-led development.\n\nThe Foundation brings together field-level implementation, professional programme management, research, partnerships and community participation to address development challenges and create lasting opportunities for underserved and vulnerable communities.\n\nOur work spans healthcare and public health, education and digital learning, skill development, livelihoods, women and youth empowerment, agriculture, environmental sustainability, water and sanitation, community development, research and social impact assessment.\n\nWe believe that sustainable development begins with understanding communities, listening to their needs and working with them to create practical and measurable solutions.",
    cards: [["Our vision", "An inclusive and sustainable India where every person can live with dignity, knowledge, health, livelihood security and equal opportunity."], ["Our mission", "To improve quality of life through participatory programmes in healthcare, education, skills, livelihoods, technology and essential services."], ["Our values", "Dignity, inclusion, integrity, participation, sustainability, accountability and innovation guide our work."], ["How we work", "We listen to communities, understand local priorities, build partnerships and use evidence to design programmes that can create lasting value."]],
  },
  "/volunteer": {
    label: "VOLUNTEER WITH US", title: "Give your time. Strengthen communities.",
    text: "Your time, skills and perspective can help create better opportunities for children, women, youth and communities.",
    cards: [["Share your expertise", "Support programme design, communications, research, technology, training, finance or community development with your professional knowledge."], ["Join field action", "Participate in education activities, awareness drives, surveys, outreach and community engagement with care and respect."], ["Mentor young people", "Help youth build confidence through career conversations, digital learning, practical skills and exposure to new opportunities."], ["Volunteer responsibly", "Respect community dignity, protect privacy, follow safeguarding practices and work in partnership with our team."]],
  },
  "/campaigns": {
    label: "CAMPAIGNS", title: "Action designed around community needs",
    text: "Our campaigns turn shared concern into practical action by bringing communities, volunteers, institutions and responsible partners together.",
    cards: [["Education for every learner", "Promoting foundational learning, digital access, study support and safe spaces where children can grow."], ["Women empowered, communities stronger", "Creating awareness and pathways in health, leadership, financial literacy, skills and livelihoods."], ["Youth ready for the future", "Connecting young people with employability skills, technology, mentoring and enterprise opportunities."], ["From awareness to action", "We listen, plan with stakeholders, implement responsibly, monitor progress and improve through learning."]],
  },
  "/credentials": {
    label: "CREDENTIALS", title: "Responsible. Transparent. Accountable.",
    text: "As a Section 8 not-for-profit organisation, SIFI Foundation is committed to responsible governance, ethical practice and transparent programme management.",
    cards: [["Governance", "Clear leadership, defined responsibilities, documentation and responsible oversight support every programme and partnership."], ["Transparency", "We aim to communicate our work clearly through programme updates, research, monitoring, documentation and reporting."], ["Responsible resources", "We value careful planning, appropriate use of resources and accountability to communities, partners and supporters."], ["Policies & safeguarding", "Privacy, child protection, volunteer conduct, donations and ethical engagement guide our interactions and decisions."]],
  },
  "/reach": {
    label: "REACH OUT", title: "Let's work together",
    text: "We welcome conversations with communities, corporate partners, government institutions, development agencies, researchers, volunteers and supporters.",
    cards: [["Visit us", "C/22, Patel Park, Harmu Housing Colony, Ranchi - 834002, Jharkhand, India."], ["Email us", "For general enquiries: info@sififoundation.org\nFor programmes and partnerships: projects@sififoundation.org"], ["Call us", "0651-3591618\nOur team will be glad to understand your interest and guide you to the right conversation."], ["Start a partnership", "Tell us about your organisation, community priorities or area of interest. Together, we can explore a practical and responsible way to contribute."]],
  },
  "/donate": {
    label: "DONATE", title: "Support change that lasts",
    text: "Your contribution can help children learn, women build independence, young people gain skills and communities access essential opportunities.",
    cards: [["Support education", "Help provide learning support, digital access, study materials and safe opportunities for children and young people."], ["Empower women", "Contribute to awareness, skills, leadership and livelihood pathways that strengthen women and families."], ["Upskill the youth", "Support vocational training, digital learning, mentoring and employment-oriented opportunities for young people."], ["Accountable impact", "We believe every contribution should support responsible planning, implementation, monitoring and transparent communication."], ["Connect with us", "Contact our team before contributing so we can share the appropriate information and discuss partnership support."]],
  },
};

const newPages = {
  "/take-action": { eyebrow: "TAKE ACTION", title: "Small actions can open big possibilities.", text: "Choose a meaningful way to stand alongside communities and turn care into practical, lasting change.", image: "Takeaction.png", cards: [["Give", "Support learning, health, skills and livelihoods through a contribution."], ["Volunteer", "Offer your time, expertise or voice where it can make a difference."], ["Partner", "Build a responsible programme with our community and institutional teams."]] },
  "/get-involved": { eyebrow: "GET INVOLVED", title: "Bring your purpose to the movement.", text: "Whether you are an individual, a team or an institution, there is a thoughtful place to begin.", image: "Getinvolbed.png", cards: [["Individuals", "Share skills, mentor young people or amplify community stories."], ["Organisations", "Design high-value CSR and development partnerships with us."], ["Communities", "Help identify priorities and shape local solutions together."]] },
  "/blog": { eyebrow: "FIELD NOTES", title: "Ideas from the ground, made for change.", text: "Stories, learning and reflections from people working to make opportunity more inclusive.", image: "Blog.png", cards: [["Learning with dignity", "Why access to consistent, joyful learning changes more than classrooms."], ["The power of local voices", "Community insight is not an input—it is the starting point."], ["Measuring meaningful progress", "Looking beyond numbers to understand durable outcomes."]] },
};

/* =========================================================================
   SHARED THEME — one warm, editorial identity used across every page
   ========================================================================= */

function useSifiFonts() {
  useEffect(() => {
    if (document.getElementById("sifi-site-fonts")) return;
    const link = document.createElement("link");
    link.id = "sifi-site-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function SifiGlobalStyle() {
  return (
    <style>{`
      .sifi-site{
        --ink:#17231C;
        --paper:#FBF7EF;
        --paper-deep:#F0E8D8;
        --marigold:#C67F17;
        --teal:#1F6F63;
        --clay:#B95C38;
        --line: rgba(23,35,28,0.12);
        font-family:"Work Sans", sans-serif;
        color:var(--ink);
        background:var(--paper);
      }
      .sifi-site *{ box-sizing:border-box; }
      .sifi-site h1,.sifi-site h2,.sifi-site h3{ font-family:"Fraunces",serif; font-weight:600; letter-spacing:-0.01em; margin:0; color:var(--ink); }
      .sifi-site p{ margin:0; }
      .sifi-site .container{ max-width:1180px; margin:0 auto; padding:0 32px; }

      /* ---- generic content pages ---- */
      .sifi-site .site-page{ padding:96px 0 112px; }
      .sifi-site .page-intro{ max-width:620px; margin-bottom:60px; }
      .sifi-site .page-intro span{ display:inline-flex; align-items:center; gap:9px; font-size:.82rem; color:var(--marigold); font-weight:500; margin-bottom:16px; }
      .sifi-site .page-intro span::before{ content:""; width:7px; height:7px; border-radius:50%; background:var(--marigold); flex:none; }
      .sifi-site .page-intro h1{ font-size:clamp(2rem,3.6vw,2.75rem); line-height:1.14; margin-bottom:18px; }
      .sifi-site .page-intro p{ font-size:1.05rem; line-height:1.75; color:rgba(23,35,28,.82); max-width:58ch; }

      /* ---- animated card grid ---- */
      .sifi-site .page-card-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:var(--line); border:1px solid var(--line); }
      .sifi-site .page-card-grid article{
        background:var(--paper);
        padding:36px 32px;
        position:relative;
        overflow:hidden;
        opacity:0;
        transform:translateY(20px);
        animation:sifiRise .6s cubic-bezier(.19,1,.22,1) forwards;
        transition:transform .4s cubic-bezier(.19,1,.22,1), box-shadow .4s ease;
      }
      .sifi-site .page-card-grid article::before{
        content:""; position:absolute; left:0; top:0; width:100%; height:3px;
        background:var(--accent, var(--marigold));
        transform:scaleX(0); transform-origin:left; transition:transform .45s cubic-bezier(.19,1,.22,1);
      }
      .sifi-site .page-card-grid article:hover{ transform:translateY(-6px); box-shadow:0 26px 50px -30px rgba(23,35,28,.4); z-index:1; }
      .sifi-site .page-card-grid article:hover::before{ transform:scaleX(1); }
      .sifi-site .page-card-grid article:nth-child(3n+1){ --accent: var(--marigold); }
      .sifi-site .page-card-grid article:nth-child(3n+2){ --accent: var(--teal); }
      .sifi-site .page-card-grid article:nth-child(3n+3){ --accent: var(--clay); }
      .sifi-site .page-card-grid article h2{ font-size:1.15rem; margin-bottom:12px; }
      .sifi-site .page-card-grid article p{ line-height:1.7; color:rgba(23,35,28,.78); font-size:.95rem; white-space:pre-line; }

      @keyframes sifiRise{ from{ opacity:0; transform:translateY(20px);} to{ opacity:1; transform:translateY(0);} }

      /* ---- feature pages: take-action / get-involved / blog fallback ---- */
      .sifi-site .feature-page{ position:relative; padding:100px 0 0; overflow:hidden; }
      .sifi-site .feature-page-orb{ position:absolute; border-radius:50%; filter:blur(70px); opacity:.32; pointer-events:none; }
      .sifi-site .orb-one{ width:340px; height:340px; background:var(--marigold); top:-130px; right:-90px; }
      .sifi-site .orb-two{ width:260px; height:260px; background:var(--teal); bottom:30px; left:-110px; }
      .sifi-site .feature-page-grid{ position:relative; display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; padding-bottom:88px; }
      .sifi-site .feature-page-copy span{ display:inline-flex; align-items:center; gap:9px; font-size:.82rem; color:var(--marigold); font-weight:500; margin-bottom:18px; }
      .sifi-site .feature-page-copy span::before{ content:""; width:7px; height:7px; border-radius:50%; background:var(--marigold); }
      .sifi-site .feature-page-copy h1{ font-size:clamp(2rem,3.6vw,2.75rem); line-height:1.14; margin-bottom:20px; }
      .sifi-site .feature-page-copy p{ font-size:1.05rem; line-height:1.75; color:rgba(23,35,28,.82); max-width:48ch; margin-bottom:28px; }
      .sifi-site .btn{ display:inline-flex; align-items:center; gap:8px; padding:14px 28px; font-weight:600; font-size:.95rem; text-decoration:none; border:1px solid var(--ink); transition:background .3s ease, color .3s ease, transform .3s ease; }
      .sifi-site .btn-primary{ background:var(--ink); color:var(--paper); }
      .sifi-site .btn-primary:hover{ background:var(--marigold); border-color:var(--marigold); color:var(--ink); transform:translateY(-2px); }
      .sifi-site .feature-page-image{ position:relative; }
      .sifi-site .feature-page-image img{ width:100%; display:block; aspect-ratio:4/3; object-fit:cover; }
      .sifi-site .feature-page-image > div{ position:absolute; bottom:-18px; left:-18px; background:var(--ink); color:var(--paper); padding:16px 20px; font-size:.85rem; line-height:1.4; }
      .sifi-site .feature-page-image > div strong{ font-family:"Fraunces",serif; font-size:1.1rem; }
      .sifi-site .feature-page-cards{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1px; background:var(--line); border-top:1px solid var(--line); }
      .sifi-site .feature-page-cards article{ background:var(--paper); padding:32px 30px 40px; position:relative; overflow:hidden; transition:transform .35s ease, box-shadow .35s ease; }
      .sifi-site .feature-page-cards article::before{ content:""; position:absolute; top:0; left:0; width:100%; height:3px; background:var(--accent, var(--marigold)); }
      .sifi-site .feature-page-cards article:nth-child(3n+1){ --accent: var(--marigold); }
      .sifi-site .feature-page-cards article:nth-child(3n+2){ --accent: var(--teal); }
      .sifi-site .feature-page-cards article:nth-child(3n+3){ --accent: var(--clay); }
      .sifi-site .feature-page-cards article:hover{ transform:translateY(-6px); box-shadow:0 20px 40px -28px rgba(23,35,28,.35); }
      .sifi-site .feature-page-cards article h2{ font-size:1.1rem; margin:6px 0 10px; }
      .sifi-site .feature-page-cards article p{ line-height:1.7; color:rgba(23,35,28,.78); font-size:.94rem; }

      /* ---- contact form ---- */
      .sifi-site .contact-form-page .feature-page-grid{ align-items:start; }
      .sifi-site .contact-form-card{ background:var(--paper-deep); padding:40px; display:grid; gap:20px; }
      .sifi-site .contact-form-card label{ display:flex; flex-direction:column; gap:8px; font-size:.85rem; font-weight:500; color:var(--ink); }
      .sifi-site .contact-form-card label.wide{ grid-column:1 / -1; }
      .sifi-site .contact-form-card input,
      .sifi-site .contact-form-card textarea{
        font-family:"Work Sans", sans-serif; font-size:.95rem; padding:12px 14px;
        border:1px solid var(--line); background:var(--paper); color:var(--ink); outline:none;
        transition:border-color .25s ease, box-shadow .25s ease;
      }
      .sifi-site .contact-form-card input:focus,
      .sifi-site .contact-form-card textarea:focus{ border-color:var(--marigold); box-shadow:0 0 0 3px rgba(198,127,23,.16); }
      .sifi-site .contact-form-card .btn{ justify-self:start; border:none; cursor:pointer; }
      .sifi-site .form-message{ font-size:.9rem; color:var(--teal); }

      @media (max-width: 860px){
        .sifi-site .feature-page-grid{ grid-template-columns:1fr; }
        .sifi-site .feature-page-image > div{ position:static; margin-top:14px; }
      }
      @media (prefers-reduced-motion: reduce){
        .sifi-site *{ animation:none !important; transition:none !important; }
        .sifi-site .page-card-grid article{ opacity:1; transform:none; }
      }
    `}</style>
  );
}

/* =========================================================================
   DYNAMIC (CMS-BACKED) PAGES
   ========================================================================= */

function DynamicContentPage({ module, fallbackPage, previewContent }) {
  const state = usePublishedContent(module);
  const items = previewContent ? [previewContent, ...state.items.filter((item) => item.id !== previewContent.id)] : state.items;
  const loading = previewContent ? false : state.loading;
  const error = previewContent ? "" : state.error;
  if (collectionThemes[module]) return <ContentCollection key={module} module={module} items={items} loading={loading} error={error} />;
  return (
    <section className="site-page">
      <div className="container">
        <div className="page-intro">
          <span>{fallbackPage.eyebrow}</span>
          <h1>{fallbackPage.title}</h1>
          <p>{fallbackPage.text}</p>
        </div>
        {loading ? <p role="status">Loading...</p> : error ? <p role="alert">Unable to load content. Please try again later.</p> : items.length ? <ContentCards items={items} module={module} /> : <p>No published content yet.</p>}
      </div>
    </section>
  );
}

function DynamicDetailPage({ module, slug }) {
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    api('/content/public/' + module + '/' + encodeURIComponent(slug)).then((value) => { if (current) setItem(value); }).catch((err) => { if (current) setError(err.message); });
    return () => { current = false; };
  }, [module, slug]);
  if (error) return <section className="site-page"><div className="container"><h1>Content not available</h1><p>{error}</p></div></section>;
  if (!item) return <section className="site-page"><div className="container"><p role="status">Loading...</p></div></section>;
  return <ContentDetailView item={item} />;
}

/* =========================================================================
   CONTACT
   ========================================================================= */

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      await api("/contact", { method: "POST", body: form });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setStatus("Thank you. Your message has been received.");
    } catch (error) {
      setStatus(error.message);
    }
  };
  return (
    <section className="feature-page contact-form-page">
      <div className="container feature-page-grid">
        <div className="feature-page-copy">
          <span>CONTACT SIFI</span>
          <h1>Let's make good work possible together.</h1>
          <p>Reach out about partnerships, volunteering, programmes or community priorities.</p>
          <ContactDetails />
        </div>
        <form className="contact-form-card" onSubmit={submit}>
          <label><span>Name</span><input name="name" value={form.name} onChange={update} required /></label>
          <label><span>Email</span><input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label><span>Phone</span><input name="phone" value={form.phone} onChange={update} /></label>
          <label><span>Subject</span><input name="subject" value={form.subject} onChange={update} /></label>
          <label className="wide"><span>Message</span><textarea name="message" value={form.message} onChange={update} rows="5" required /></label>
          <button className="btn btn-primary" type="submit">Send message</button>
          {status && <p className="form-message">{status}</p>}
        </form>
      </div>
    </section>
  );
}

/* =========================================================================
   FEATURE PAGES — take action / get involved / blog fallback
   ========================================================================= */

function NewPage({ page }) {
  return (
    <section className="feature-page">
      <div className="feature-page-orb orb-one" />
      <div className="feature-page-orb orb-two" />
      <div className="container feature-page-grid">
        <div className="feature-page-copy">
          <span>{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.text}</p>
          <a className="btn btn-primary" href="/donate">Start today</a>
        </div>
        <div className="feature-page-image">
          <img src={`/images/${page.image}`} alt="SIFI Foundation community work" />
          <div>Community-led<br /><strong>change</strong></div>
        </div>
      </div>
      <div className="container feature-page-cards">
        {page.cards.map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   ABOUT PAGE — CINEMATIC EDITION
   Palette: night-green (#050D0A) + teal + marigold + clay + dusk-violet
   Effects: fixed aurora backdrop, floating SVG particles, film grain,
            vignette, letterbox open, sunrise horizon, parallax, cursor light
   ========================================================================= */

/* Focus areas — about text me jo areas likhe hain wahi yahan marquee me chalte hain */
const FOCUS_AREAS = [
  "Healthcare and public health",
  "Education and digital learning",
  "Skill development",
  "Livelihoods",
  "Women and youth empowerment",
  "Agriculture",
  "Environmental sustainability",
  "Water and sanitation",
  "Community development",
  "Research and social impact assessment",
];

/* Particles ko seeded random se banate hain taaki har render pe same rahein (no flicker) */
function makeParticles(count) {
  let seed = 11;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rnd() * 100,
    size: 9 + rnd() * 24,
    duration: 18 + rnd() * 24,
    delay: -rnd() * 34, // negative delay: page open hote hi poori screen me particles dikhen
    drift: (rnd() - 0.5) * 240,
    rot: (rnd() - 0.5) * 600,
    kind: i % 4,
    tone: i % 5,
    twinkle: 3 + (i % 5),
  }));
}
const PARTICLES = makeParticles(44);

function ParticleShape({ kind }) {
  if (kind === 0) return (<><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".18" /><circle cx="12" cy="12" r="4" fill="currentColor" /></>);
  if (kind === 1) return <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" fill="currentColor" />; // patta / leaf
  if (kind === 2) return <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" fill="currentColor" />; // chamak / spark
  return <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />; // ring
}

function ParticleField() {
  return (
    <div className="sa-particles">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={`sa-p sa-t${p.tone}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--rot": `${p.rot}deg`,
          }}
        >
          <svg viewBox="0 0 24 24" style={{ animationDuration: `${p.twinkle}s` }}><ParticleShape kind={p.kind} /></svg>
        </span>
      ))}
    </div>
  );
}

/* Hero ke neeche sunrise + hills + udte panchi (SVG) */
function HorizonScene() {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg className="sa-horizon" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="saSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFD98A" stopOpacity=".95" />
          <stop offset=".35" stopColor="#F2A93B" stopOpacity=".5" />
          <stop offset="1" stopColor="#E8734C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="saSunBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A3" />
          <stop offset="1" stopColor="#F2A93B" />
        </linearGradient>
        <linearGradient id="saHillA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33C2AE" stopOpacity=".55" />
          <stop offset="1" stopColor="#0B1F1A" />
        </linearGradient>
        <linearGradient id="saHillB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F6F63" />
          <stop offset="1" stopColor="#07140F" />
        </linearGradient>
        <linearGradient id="saHillC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C1D18" />
          <stop offset="1" stopColor="#050D0A" />
        </linearGradient>
      </defs>

      <circle className="sa-sun-glow" cx="720" cy="215" r="260" fill="url(#saSunGlow)" />
      <g className="sa-rays" stroke="#FFD98A" strokeWidth="2" strokeLinecap="round" opacity=".55">
        {rays.map((deg) => (
          <line key={deg} x1="720" y1="95" x2="720" y2={deg % 45 === 0 ? 52 : 70} transform={`rotate(${deg} 720 215)`} />
        ))}
      </g>
      <circle cx="720" cy="215" r="70" fill="url(#saSunBody)" />

      <g className="sa-hill sa-hill--a"><path d="M0 250C180 190 340 210 520 245S860 290 1040 235 1320 200 1440 240V420H0Z" fill="url(#saHillA)" /></g>
      <g className="sa-hill sa-hill--b"><path d="M0 300C220 250 420 285 640 300S1020 330 1220 280 1380 265 1440 285V420H0Z" fill="url(#saHillB)" /></g>
      <g className="sa-hill sa-hill--c"><path d="M0 350C240 320 460 345 720 355S1180 340 1440 332V420H0Z" fill="url(#saHillC)" /></g>

      {[[70, "0s", 26], [150, "-6s", 30], [110, "-13s", 34]].map(([y, delay, dur], i) => (
        <g key={i} className="sa-bird" style={{ "--by": `${y}px`, animationDelay: delay, animationDuration: `${dur}s` }}>
          <path className="sa-wing" d="M0 0Q6 -8 12 0Q18 -8 24 0" fill="none" stroke="#FBF7EF" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* Community network — nodes aur links jo pulse karte hain */
const NET_NODES = [[200, 150, 9], [90, 70, 5], [310, 60, 6], [345, 195, 5], [110, 240, 6], [255, 260, 5], [38, 160, 4]];
const NET_LINKS = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [6, 4], [2, 3], [3, 5]];

function NetworkArt({ className = "" }) {
  return (
    <svg className={`sa-net ${className}`} viewBox="0 0 400 300" aria-hidden="true">
      {NET_LINKS.map(([a, b], i) => (
        <line key={i} className="sa-net-line" x1={NET_NODES[a][0]} y1={NET_NODES[a][1]} x2={NET_NODES[b][0]} y2={NET_NODES[b][1]} style={{ animationDelay: `${i * -0.7}s` }} />
      ))}
      <circle className="sa-ripple" cx="200" cy="150" r="14" />
      <circle className="sa-ripple sa-ripple--2" cx="200" cy="150" r="14" />
      {NET_NODES.map(([x, y, r], i) => (
        <g key={i}>
          <circle className="sa-node-halo" cx={x} cy={y} r={r * 2.2} style={{ animationDelay: `${i * -0.5}s` }} />
          <circle className={`sa-node sa-node--${i % 3}`} cx={x} cy={y} r={r} />
        </g>
      ))}
    </svg>
  );
}

/* Ghumte hue orbit rings — image ke peeche */
function OrbitRings({ className = "" }) {
  return (
    <svg className={`sa-orbits ${className}`} viewBox="0 0 500 500" aria-hidden="true">
      <circle className="sa-ring sa-ring--1" cx="250" cy="250" r="232" />
      <circle className="sa-ring sa-ring--2" cx="250" cy="250" r="200" />
      <g className="sa-orbit sa-orbit--1"><circle cx="250" cy="18" r="6" fill="#F2A93B" /><circle cx="250" cy="18" r="12" fill="#F2A93B" opacity=".25" /></g>
      <g className="sa-orbit sa-orbit--2"><circle cx="250" cy="50" r="5" fill="#33C2AE" /><circle cx="250" cy="50" r="10" fill="#33C2AE" opacity=".25" /></g>
    </svg>
  );
}

/* Cinematic frame — viewfinder corners + REC tag + light sweep */
function Shot({ src, alt, tag, className = "" }) {
  return (
    <div className={`sa-frame ${className}`}>
      <div className="sa-shot">
        <img src={src} alt={alt} />
        <span className="sa-rec"><i />{tag}</span>
      </div>
      <b className="sa-corner sa-corner--tl" /><b className="sa-corner sa-corner--tr" />
      <b className="sa-corner sa-corner--bl" /><b className="sa-corner sa-corner--br" />
    </div>
  );
}

function Kicker({ no, children }) {
  return (
    <p className="sa-kicker"><span className="sa-kicker-dot" aria-hidden="true" />{no ? <em>Scene {no}</em> : null}<span>{children}</span></p>
  );
}

/* Value icons — stroke draw animation ke liye pathLength="1" */
const VALUE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i0"><path pathLength="1" d="M4 17h16M6.5 17a5.5 5.5 0 0 1 11 0" strokeLinecap="round" /><path pathLength="1" d="M12 4v3M6 7l1.8 1.8M18 7l-1.8 1.8" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i1"><circle pathLength="1" cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path pathLength="1" d="M12 2.8v2.4M21.2 12h-2.4" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i2"><path pathLength="1" d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15Z" strokeLinejoin="round" /><path pathLength="1" d="M6 18C9 13 12 10 17 7" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i3"><circle pathLength="1" cx="9" cy="12" r="5.4" /><circle pathLength="1" cx="15" cy="12" r="5.4" /></svg>,
];

function AboutPage({ page }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    /* Scroll: parallax (--sy) aur progress bar (--progress) — rAF se throttle */
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--sy", y.toFixed(1));
      root.style.setProperty("--progress", (max > 0 ? Math.min(1, y / max) : 0).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    /* Mouse: hero tilt (--mx, --my) aur cursor ki roshni (--cx, --cy) */
    const onMove = (e) => {
      root.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      root.style.setProperty("--cx", `${e.clientX}px`);
      root.style.setProperty("--cy", `${e.clientY}px`);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("mousemove", onMove, { passive: true });

    /* Reveal: element screen me aate hi .is-in lagta hai */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    root.querySelectorAll(".sa-reveal").forEach((el) => observer.observe(el));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  /* Card ke andar cursor ki spotlight */
  const spot = (event) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty("--py", `${event.clientY - r.top}px`);
  };

  const paragraphs = page.text.split("\n\n");
  const rowA = [...FOCUS_AREAS, ...FOCUS_AREAS];
  const rowB = [...FOCUS_AREAS].reverse();
  const rowBLoop = [...rowB, ...rowB];

  return (
    <section ref={rootRef} className="sifi-about">
      {/* ---------- fixed cinematic backdrop: poore page pe rehta hai ---------- */}
      <div className="sa-backdrop" aria-hidden="true">
        <div className="sa-aurora sa-aurora--a" />
        <div className="sa-aurora sa-aurora--b" />
        <div className="sa-aurora sa-aurora--c" />
        <div className="sa-aurora sa-aurora--d" />
        <div className="sa-dusk" />
        <div className="sa-spot" />
        <ParticleField />
      </div>
      <div className="sa-vignette" aria-hidden="true" />
      <div className="sa-grain" aria-hidden="true" />
      <div className="sa-progress" aria-hidden="true" />

      {/* ---------------- Scene 01 : hero ---------------- */}
      <div className="sa-hero">
        <div className="sa-bar sa-bar--t" aria-hidden="true" />
        <div className="sa-bar sa-bar--b" aria-hidden="true" />
        <div className="sa-leak" aria-hidden="true" />
        <HorizonScene />

        <div className="sa-hero-inner">
          <div className="sa-hero-copy">
            <Kicker no="01">About SIFI Foundation</Kicker>
            <h1 className="sa-hero-title" aria-label={page.title}>
              {page.title.split(" ").map((word, i) => (
                <span className="sa-word" key={`${word}-${i}`} aria-hidden="true">
                  <span style={{ animationDelay: `${0.55 + i * 0.09}s, 0s` }}>{word}</span>
                </span>
              ))}
            </h1>
            <p className="sa-lead">{paragraphs[0]}</p>
            <div className="sa-actions">
              <a className="sa-btn sa-btn--gold" href="/donate">Support our work</a>
              <a className="sa-btn sa-btn--ghost" href="/reach">Get in touch</a>
            </div>
          </div>

          <div className="sa-hero-visual">
            <OrbitRings />
            <div className="sa-tilt">
              <Shot className="sa-frame--hero" src="/images/about1.png" alt="SIFI Foundation working alongside communities" tag="SIFI Foundation" />
              <span className="sa-chip sa-chip--a">Section 8 not-for-profit</span>
              <span className="sa-chip sa-chip--b">Ranchi, Jharkhand</span>
            </div>
          </div>
        </div>

        <div className="sa-scroll" aria-hidden="true"><i /></div>
      </div>

      {/* ---------------- focus areas marquee ---------------- */}
      <div className="sa-marquee" aria-label="Our focus areas">
        <div className="sa-track">
          {rowA.map((label, i) => (
            <span className="sa-mq" key={`a-${i}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" fill="currentColor" /></svg>
              {label}
            </span>
          ))}
        </div>
        <div className="sa-track sa-track--rev">
          {rowBLoop.map((label, i) => (
            <span className="sa-mq sa-mq--alt" key={`b-${i}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="currentColor" /></svg>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Scene 02 : approach ---------------- */}
      <div className="sa-story">
        <div className="sa-media sa-reveal sa-reveal--left">
          <NetworkArt />
          <Shot className="sa-frame--teal" src="/images/about2.png" alt="SIFI Foundation community-led programmes" tag="Community-led" />
        </div>
        <div className="sa-story-copy sa-reveal sa-reveal--up" style={{ "--sa-delay": ".15s" }}>
          <Kicker no="02">Our approach</Kicker>
          <h2>Working with communities to create lasting opportunity</h2>
          <p>{paragraphs[1]}</p>
          <p>{paragraphs[2]}</p>
        </div>
      </div>

      {/* ---------------- Scene 03 : belief ---------------- */}
      <div className="sa-story sa-story--reverse">
        <div className="sa-story-copy sa-reveal sa-reveal--up">
          <Kicker no="03">Our belief</Kicker>
          <h2>Practical action, measurable solutions</h2>
          <blockquote className="sa-quote">
            <svg className="sa-quote-mark" viewBox="0 0 48 40" aria-hidden="true"><path d="M0 40V22C0 9 7 2 20 0v8C13 10 10 14 10 20h10v20Zm26 0V22C26 9 33 2 46 0v8c-7 2-10 6-10 12h10v20Z" fill="currentColor" /></svg>
            {paragraphs[3]}
          </blockquote>
        </div>
        <div className="sa-media sa-reveal sa-reveal--right" style={{ "--sa-delay": ".15s" }}>
          <NetworkArt className="sa-net--left" />
          <Shot className="sa-frame--clay" src="/images/about3.png" alt="SIFI Foundation's vision for stronger communities" tag="Vision" />
        </div>
      </div>

      {/* ---------------- Scene 04 : values ---------------- */}
      <div className="sa-values-head sa-reveal sa-reveal--up">
        <Kicker no="04">What guides us</Kicker>
        <h2>People, progress and possibilities</h2>
      </div>
      <div className="sa-values">
        {page.cards.map(([title, text], index) => (
          <div className="sa-reveal sa-reveal--zoom" key={title} style={{ "--sa-delay": `${index * 110}ms` }}>
            <article className={`sa-value sa-value--${index % 4}`} onMouseMove={spot}>
              <span className="sa-value-no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="sa-value-icon">{VALUE_ICONS[index % VALUE_ICONS.length]}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          </div>
        ))}
      </div>

      {/* ---------------- Scene 05 : closing ---------------- */}
      <div className="sa-cta sa-reveal sa-reveal--zoom">
        <div className="sa-cta-card">
          <OrbitRings className="sa-orbits--cta" />
          <Kicker no="05">Join us</Kicker>
          <h2>Build lasting opportunity with us</h2>
          <p>Support our work, volunteer your time or explore a partnership with SIFI Foundation.</p>
          <div className="sa-actions sa-actions--center">
            <a className="sa-btn sa-btn--gold" href="/donate">Donate</a>
            <a className="sa-btn sa-btn--ghost" href="/volunteer">Volunteer</a>
            <a className="sa-btn sa-btn--ghost" href="/reach">Start a partnership</a>
          </div>
        </div>
      </div>

      <style>{`
        .sifi-about{
          --sa-night:#050D0A;
          --sa-deep:#0B1F1A;
          --sa-cream:#FBF7EF;
          --sa-gold:#F2A93B;
          --sa-teal:#33C2AE;
          --sa-clay:#E8734C;
          --sa-dusk:#7C5CFA;
          --sa-line:rgba(251,247,239,.14);
          --sa-muted:rgba(251,247,239,.78);
          --sy:0; --progress:0; --mx:0; --my:0;
          position:relative;
          isolation:isolate;
          box-sizing:border-box;
          max-width:100vw;
          overflow-x:hidden;
          overflow-x:clip;
          clip-path:inset(0); /* fixed backdrop sirf is section ke andar dikhe, header ke upar na aaye */
          background:var(--sa-night);
          color:var(--sa-cream);
          font-family:"Work Sans", sans-serif;
          padding-bottom:110px;
        }
        .sifi-about *{ box-sizing:border-box; }
        .sifi-about h1,.sifi-about h2,.sifi-about h3{ font-family:"Fraunces", serif; font-weight:600; letter-spacing:-0.01em; margin:0; color:var(--sa-cream); }
        .sifi-about p{ margin:0; }
        .sifi-about ::selection{ background:var(--sa-gold); color:#1A120A; }

        /* ===== fixed backdrop ===== */
        .sa-backdrop{ position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
          background:linear-gradient(180deg,#050D0A 0%,#0A1E19 45%,#150F12 100%); }
        .sa-aurora{ position:absolute; border-radius:50%; filter:blur(90px); opacity:.5; }
        .sa-aurora--a{ width:56vw; height:56vw; left:-16vw; top:-14vw; background:radial-gradient(circle,var(--sa-teal),transparent 65%); animation:saDriftA 26s ease-in-out infinite alternate; translate:0 calc(var(--sy) * -.06px); }
        .sa-aurora--b{ width:46vw; height:46vw; right:-12vw; top:6vh; background:radial-gradient(circle,var(--sa-gold),transparent 65%); opacity:.38; animation:saDriftB 30s ease-in-out infinite alternate; translate:0 calc(var(--sy) * -.1px); }
        .sa-aurora--c{ width:50vw; height:50vw; left:-10vw; bottom:-22vw; background:radial-gradient(circle,var(--sa-clay),transparent 65%); opacity:.34; animation:saDriftC 34s ease-in-out infinite alternate; translate:0 calc(var(--sy) * -.04px); }
        .sa-aurora--d{ width:42vw; height:42vw; right:6vw; bottom:-16vw; background:radial-gradient(circle,var(--sa-dusk),transparent 65%); opacity:.4; animation:saDriftD 28s ease-in-out infinite alternate; translate:0 calc(var(--sy) * -.08px); }
        .sa-dusk{ position:absolute; inset:0; background:linear-gradient(180deg,transparent 10%,rgba(232,115,76,.20) 65%,rgba(124,92,250,.24)); opacity:calc(var(--progress) * 1.25); }
        .sa-spot{ position:absolute; inset:0; background:radial-gradient(440px circle at var(--cx,50%) var(--cy,30%),rgba(242,169,59,.11),transparent 62%); }

        /* ===== SVG particles ===== */
        .sa-particles{ position:absolute; inset:0; }
        .sa-p{ position:absolute; bottom:-40px; display:block; opacity:0; animation:saFloat linear infinite; will-change:transform,opacity; }
        .sa-p svg{ width:100%; height:100%; display:block; overflow:visible; animation:saSway ease-in-out infinite alternate; }
        .sa-t0{ color:var(--sa-gold); }
        .sa-t1{ color:var(--sa-teal); }
        .sa-t2{ color:var(--sa-clay); }
        .sa-t3{ color:var(--sa-cream); }
        .sa-t4{ color:#A594FF; }

        /* ===== film overlays ===== */
        .sa-vignette{ position:fixed; inset:0; z-index:14; pointer-events:none; background:radial-gradient(120% 100% at 50% 45%,transparent 55%,rgba(0,0,0,.55)); }
        .sa-grain{ position:fixed; inset:-50%; width:200%; height:200%; z-index:15; pointer-events:none; opacity:.08; mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.6'/></svg>");
          animation:saGrain .9s steps(6) infinite; }
        .sa-progress{ position:fixed; left:0; bottom:0; width:100%; height:3px; z-index:20; pointer-events:none; transform-origin:left; transform:scaleX(var(--progress));
          background:linear-gradient(90deg,var(--sa-teal),var(--sa-gold),var(--sa-clay),var(--sa-dusk)); }

        /* ===== shared bits ===== */
        .sa-kicker{ display:flex; align-items:center; gap:10px; font-size:.9rem; color:var(--sa-gold); margin-bottom:20px; font-weight:500; }
        .sa-kicker em{ font-style:normal; color:var(--sa-cream); opacity:.6; }
        .sa-kicker em::after{ content:"/"; margin-left:10px; opacity:.5; }
        .sa-kicker-dot{ width:8px; height:8px; border-radius:50%; background:var(--sa-gold); flex:none; box-shadow:0 0 0 0 rgba(242,169,59,.6); animation:saPulse 2.4s ease-out infinite; }

        .sa-btn{ position:relative; display:inline-flex; align-items:center; justify-content:center; padding:15px 30px; border-radius:999px; font-weight:600; font-size:.95rem; text-decoration:none; overflow:hidden; transition:transform .3s ease, box-shadow .3s ease, background .3s ease; }
        .sa-btn:hover{ transform:translateY(-3px); }
        .sa-btn:focus-visible{ outline:2px solid var(--sa-cream); outline-offset:4px; }
        .sa-btn--gold{ color:#1A120A; background:linear-gradient(120deg,#F9CF7A,#F2A93B 45%,#E8734C); box-shadow:0 14px 40px -14px rgba(242,169,59,.75); }
        .sa-btn--gold::after{ content:""; position:absolute; inset:0; background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%); transform:translateX(-120%); animation:saSweep 4.5s ease-in-out infinite; }
        .sa-btn--ghost{ color:var(--sa-cream); border:1px solid var(--sa-line); background:rgba(255,255,255,.05); backdrop-filter:blur(8px); }
        .sa-btn--ghost:hover{ background:rgba(255,255,255,.12); border-color:rgba(251,247,239,.4); }
        .sa-actions{ display:flex; flex-wrap:wrap; gap:14px; margin-top:34px; }
        .sa-actions--center{ justify-content:center; }

        /* ===== reveal (scroll) ===== */
        .sa-reveal{ opacity:0; filter:blur(8px); transform:translateY(34px); transition:opacity 1s ease var(--sa-delay,0s), filter 1s ease var(--sa-delay,0s), transform 1s cubic-bezier(.19,1,.22,1) var(--sa-delay,0s); }
        .sa-reveal--left{ transform:translateX(-56px); }
        .sa-reveal--right{ transform:translateX(56px); }
        .sa-reveal--zoom{ transform:scale(.93) translateY(20px); }
        .sa-reveal.is-in{ opacity:1; filter:none; transform:none; }

        /* ===== hero ===== */
        .sa-hero{ position:relative; min-height:min(96vh,920px); display:flex; align-items:center; padding:110px 0 230px; overflow:hidden; }
        .sa-hero-inner{ position:relative; z-index:3; width:100%; max-width:1180px; margin:0 auto; padding:0 32px; display:grid; grid-template-columns:1.05fr .95fr; gap:64px; align-items:center; }
        .sa-hero-copy > .sa-kicker,
        .sa-hero-copy > .sa-lead,
        .sa-hero-copy > .sa-actions{ opacity:0; animation:saRise .9s cubic-bezier(.19,1,.22,1) forwards; }
        .sa-hero-copy > .sa-kicker{ animation-delay:.25s; }
        .sa-hero-copy > .sa-lead{ animation-delay:1.3s; }
        .sa-hero-copy > .sa-actions{ animation-delay:1.55s; }

        .sa-hero-title{ font-size:clamp(2.2rem,4.4vw,3.6rem); line-height:1.1; }
        .sa-word{ display:inline-block; overflow:hidden; vertical-align:top; padding:0 .04em .14em; margin-right:.2em; }
        .sa-word > span{ display:inline-block; transform:translateY(110%); filter:blur(10px);
          background:linear-gradient(100deg,#FBF7EF 0%,#F9D48A 35%,#F2A93B 50%,#F9D48A 65%,#FBF7EF 100%); background-size:220% 100%;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent;
          animation:saWordUp 1s cubic-bezier(.16,.84,.24,1) forwards, saShine 9s linear infinite; }
        .sa-lead{ margin-top:24px; max-width:54ch; font-size:1.06rem; line-height:1.8; color:var(--sa-muted); }

        .sa-hero-visual{ position:relative; max-width:450px; width:100%; justify-self:center; perspective:1100px; opacity:0; animation:saZoomIn 1.4s cubic-bezier(.19,1,.22,1) 1s forwards; }
        .sa-tilt{ position:relative; transform-style:preserve-3d; transform:rotateY(calc(var(--mx) * 8deg)) rotateX(calc(var(--my) * -8deg)); transition:transform .25s ease-out; }
        .sa-chip{ position:absolute; z-index:4; padding:10px 16px; border-radius:999px; font-size:.82rem; font-weight:500; background:rgba(8,20,16,.62); border:1px solid var(--sa-line); backdrop-filter:blur(12px); color:var(--sa-cream); animation:saBob 6s ease-in-out infinite; }
        .sa-chip--a{ top:24px; left:-40px; }
        .sa-chip--b{ bottom:34px; right:-26px; animation-delay:-3s; }

        .sa-horizon{ position:absolute; left:0; right:0; bottom:0; width:100%; height:min(48vh,440px); z-index:1; pointer-events:none; }
        .sa-sun-glow{ transform-box:fill-box; transform-origin:center; animation:saSunPulse 7s ease-in-out infinite; }
        .sa-rays{ transform-origin:720px 215px; animation:saSpin 90s linear infinite; }
        .sa-hill--a{ transform:translateY(calc(var(--sy) * .05px)); }
        .sa-hill--b{ transform:translateY(calc(var(--sy) * .03px)); }
        .sa-hill--c{ transform:translateY(calc(var(--sy) * .015px)); }
        .sa-bird{ animation:saFly linear infinite; }
        .sa-wing{ transform-box:fill-box; transform-origin:center; animation:saFlap .9s ease-in-out infinite alternate; }

        .sa-bar{ position:absolute; left:0; right:0; height:9vh; background:#000; z-index:9; pointer-events:none; animation:saBar 1.5s cubic-bezier(.7,0,.2,1) 1.1s forwards; }
        .sa-bar--t{ top:0; } .sa-bar--b{ bottom:0; }
        .sa-leak{ position:absolute; top:-20%; left:-30%; width:60%; height:140%; z-index:2; pointer-events:none; mix-blend-mode:screen; filter:blur(50px);
          background:linear-gradient(100deg,transparent,rgba(242,169,59,.28),rgba(232,115,76,.22),transparent); animation:saLeak 16s ease-in-out infinite; }
        .sa-scroll{ position:absolute; bottom:28px; left:50%; width:22px; height:38px; margin-left:-11px; z-index:4; border:1.5px solid rgba(251,247,239,.5); border-radius:12px; }
        .sa-scroll i{ position:absolute; left:50%; top:7px; width:3px; height:8px; margin-left:-1.5px; border-radius:2px; background:var(--sa-gold); animation:saScrollCue 1.8s ease-in-out infinite; }

        /* ===== cinematic frame ===== */
        .sa-frame{ position:relative; padding:12px; border-radius:6px; background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.03)); border:1px solid var(--sa-line);
          box-shadow:0 44px 80px -34px rgba(0,0,0,.8), 0 0 70px -14px rgba(242,169,59,.28); }
        .sa-frame--teal{ box-shadow:0 44px 80px -34px rgba(0,0,0,.8), 0 0 70px -14px rgba(51,194,174,.35); }
        .sa-frame--clay{ box-shadow:0 44px 80px -34px rgba(0,0,0,.8), 0 0 70px -14px rgba(232,115,76,.38); }
        .sa-shot{ position:relative; overflow:hidden; border-radius:3px; background:#000; }
        .sa-shot img{ display:block; width:100%; height:100%; aspect-ratio:5/4; object-fit:cover; filter:saturate(1.1) contrast(1.06); animation:saKen 22s ease-in-out infinite alternate; }
        .sa-frame--hero .sa-shot img{ aspect-ratio:4/4.7; }
        .sa-shot::before{ content:""; position:absolute; inset:0; z-index:1; pointer-events:none;
          background:radial-gradient(120% 90% at 50% 40%,transparent 50%,rgba(0,0,0,.5)), linear-gradient(160deg,rgba(51,194,174,.18),transparent 45%,rgba(232,115,76,.22)); }
        .sa-shot::after{ content:""; position:absolute; inset:0; z-index:2; pointer-events:none; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.22) 50%,transparent 60%); transform:translateX(-130%); animation:saSweep 7s ease-in-out infinite; }
        .sa-rec{ position:absolute; z-index:3; left:14px; top:14px; display:inline-flex; align-items:center; gap:8px; padding:5px 10px; border-radius:999px; font-size:.74rem; font-weight:500; color:var(--sa-cream); background:rgba(0,0,0,.45); backdrop-filter:blur(6px); }
        .sa-rec i{ width:7px; height:7px; border-radius:50%; background:#FF4B4B; animation:saBlink 1.4s steps(2) infinite; }
        .sa-corner{ position:absolute; width:18px; height:18px; border:2px solid var(--sa-gold); pointer-events:none; opacity:.9; }
        .sa-corner--tl{ top:-6px; left:-6px; border-right:0; border-bottom:0; }
        .sa-corner--tr{ top:-6px; right:-6px; border-left:0; border-bottom:0; }
        .sa-corner--bl{ bottom:-6px; left:-6px; border-right:0; border-top:0; }
        .sa-corner--br{ bottom:-6px; right:-6px; border-left:0; border-top:0; }

        /* ===== orbit rings ===== */
        .sa-orbits{ position:absolute; inset:-9%; width:118%; height:118%; z-index:0; pointer-events:none; overflow:visible; }
        .sa-ring{ fill:none; stroke:rgba(251,247,239,.22); stroke-width:1; transform-origin:250px 250px; }
        .sa-ring--1{ stroke-dasharray:4 10; animation:saSpin 70s linear infinite; }
        .sa-ring--2{ stroke:rgba(242,169,59,.28); animation:saSpinRev 90s linear infinite; }
        .sa-orbit{ transform-origin:250px 250px; }
        .sa-orbit--1{ animation:saSpin 22s linear infinite; }
        .sa-orbit--2{ animation:saSpinRev 30s linear infinite; }
        .sa-orbits--cta{ inset:auto; left:50%; top:50%; width:min(900px,120%); height:auto; aspect-ratio:1; margin:0; translate:-50% -50%; opacity:.5; }

        /* ===== network art ===== */
        .sa-media{ position:relative; translate:0 calc(var(--sy) * -.01px); }
        .sa-media .sa-frame{ position:relative; z-index:1; }
        .sa-net{ position:absolute; z-index:0; width:78%; right:-22%; top:-20%; overflow:visible; pointer-events:none; }
        .sa-net--left{ right:auto; left:-22%; }
        .sa-net-line{ stroke:rgba(251,247,239,.35); stroke-width:1; stroke-dasharray:4 7; animation:saDash 3s linear infinite; }
        .sa-node{ fill:var(--sa-gold); }
        .sa-node--1{ fill:var(--sa-teal); }
        .sa-node--2{ fill:var(--sa-clay); }
        .sa-node-halo{ fill:rgba(251,247,239,.12); transform-box:fill-box; transform-origin:center; animation:saHalo 3.4s ease-in-out infinite; }
        .sa-ripple{ fill:none; stroke:var(--sa-gold); stroke-width:1.5; transform-box:fill-box; transform-origin:center; animation:saRipple 3.6s ease-out infinite; }
        .sa-ripple--2{ animation-delay:-1.8s; }

        /* ===== marquee ===== */
        .sa-marquee{ position:relative; z-index:2; margin:0 0 120px; padding:18px 0; overflow:hidden; display:grid; gap:14px;
          border-block:1px solid var(--sa-line); background:rgba(255,255,255,.035); backdrop-filter:blur(8px);
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); }
        .sa-track{ display:flex; gap:44px; width:max-content; animation:saMarq 55s linear infinite; }
        .sa-track--rev{ animation-direction:reverse; animation-duration:65s; }
        .sa-mq{ display:inline-flex; align-items:center; gap:12px; white-space:nowrap; font-family:"Fraunces",serif; font-size:1.35rem; color:var(--sa-cream); }
        .sa-mq svg{ width:14px; height:14px; color:var(--sa-gold); flex:none; animation:saSpin 8s linear infinite; }
        .sa-mq--alt{ color:rgba(251,247,239,.62); }
        .sa-mq--alt svg{ color:var(--sa-teal); animation:none; }

        /* ===== story scenes ===== */
        .sa-story{ position:relative; z-index:2; max-width:1180px; margin:0 auto; padding:0 32px 130px; display:grid; grid-template-columns:.9fr 1.1fr; gap:80px; align-items:center; }
        .sa-story--reverse{ grid-template-columns:1.1fr .9fr; }
        .sa-story-copy h2{ font-size:clamp(1.75rem,2.9vw,2.4rem); line-height:1.15; margin-bottom:24px; }
        .sa-story-copy > p{ line-height:1.85; color:var(--sa-muted); max-width:56ch; }
        .sa-story-copy > p + p{ margin-top:18px; }
        .sa-quote{ position:relative; margin:0; padding:26px 0 0 26px; border-left:3px solid var(--sa-gold); font-family:"Fraunces",serif; font-style:italic; font-size:clamp(1.15rem,1.7vw,1.4rem); line-height:1.65; color:var(--sa-cream); max-width:50ch; }
        .sa-quote-mark{ position:absolute; top:-6px; left:22px; width:38px; color:var(--sa-gold); opacity:.35; animation:saBob 7s ease-in-out infinite; }

        /* ===== values ===== */
        .sa-values-head{ position:relative; z-index:2; max-width:1180px; margin:0 auto; padding:0 32px 44px; }
        .sa-values-head h2{ font-size:clamp(1.75rem,2.9vw,2.4rem); max-width:20ch; line-height:1.15; }
        .sa-values{ position:relative; z-index:2; max-width:1180px; margin:0 auto; padding:0 32px; display:grid; grid-template-columns:1fr 1fr; gap:22px; }
        .sa-value{ --vc:var(--sa-gold); position:relative; height:100%; overflow:hidden; padding:40px 36px; border-radius:8px; border:1px solid var(--sa-line);
          background:rgba(255,255,255,.055); backdrop-filter:blur(14px); transition:translate .35s ease, border-color .35s ease, box-shadow .35s ease; }
        .sa-value--1{ --vc:var(--sa-teal); } .sa-value--2{ --vc:var(--sa-clay); } .sa-value--3{ --vc:#A594FF; }
        .sa-value::before{ content:""; position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .35s ease;
          background:radial-gradient(300px circle at var(--px,50%) var(--py,50%),color-mix(in srgb,var(--vc) 28%,transparent),transparent 65%); }
        .sa-value::after{ content:""; position:absolute; left:0; top:0; width:100%; height:3px; background:linear-gradient(90deg,var(--vc),transparent); }
        .sa-value:hover{ translate:0 -6px; border-color:var(--vc); box-shadow:0 30px 60px -30px var(--vc); }
        .sa-value:hover::before{ opacity:1; }
        .sa-value > *{ position:relative; }
        .sa-value-no{ position:absolute !important; right:24px; top:14px; font-family:"Fraunces",serif; font-size:3.6rem; line-height:1; color:transparent; -webkit-text-stroke:1px rgba(251,247,239,.22); }
        .sa-value-icon{ display:inline-flex; align-items:center; justify-content:center; width:54px; height:54px; margin-bottom:20px; border-radius:50%; color:var(--vc); background:color-mix(in srgb,var(--vc) 16%,transparent); box-shadow:0 0 0 0 var(--vc); animation:saPulse 3.2s ease-out infinite; }
        .sa-value-icon svg{ width:28px; height:28px; }
        .sa-value-icon svg *{ stroke-dasharray:1; stroke-dashoffset:1; animation:saDraw 2.4s ease forwards 1s; }
        .sa-value h3{ font-size:1.25rem; margin-bottom:12px; }
        .sa-value p{ line-height:1.75; color:var(--sa-muted); font-size:.97rem; }

        /* ===== closing ===== */
        .sa-cta{ position:relative; z-index:2; max-width:1180px; margin:130px auto 0; padding:0 32px; }
        .sa-cta-card{ position:relative; overflow:hidden; padding:88px 48px; text-align:center; border-radius:12px; border:1px solid var(--sa-line);
          background:radial-gradient(120% 140% at 0% 0%,rgba(242,169,59,.30),transparent 55%), radial-gradient(120% 140% at 100% 100%,rgba(124,92,250,.32),transparent 55%), rgba(255,255,255,.04); }
        .sa-cta-card > *:not(.sa-orbits){ position:relative; z-index:1; }
        .sa-cta-card .sa-kicker{ justify-content:center; }
        .sa-cta-card h2{ font-size:clamp(1.9rem,3.4vw,2.8rem); line-height:1.15; max-width:22ch; margin:0 auto 18px; }
        .sa-cta-card > p{ max-width:52ch; margin:0 auto; line-height:1.8; color:var(--sa-muted); }

        /* ===== keyframes ===== */
        @keyframes saRise{ from{ opacity:0; transform:translateY(22px);} to{ opacity:1; transform:none;} }
        @keyframes saWordUp{ to{ transform:translateY(0); filter:blur(0);} }
        @keyframes saShine{ from{ background-position:0% 0;} to{ background-position:-220% 0;} }
        @keyframes saZoomIn{ from{ opacity:0; transform:scale(.9) translateY(30px);} to{ opacity:1; transform:none;} }
        @keyframes saFloat{ 0%{ transform:translate3d(0,0,0) rotate(0); opacity:0;} 10%{ opacity:.9;} 85%{ opacity:.7;} 100%{ transform:translate3d(var(--drift),-118vh,0) rotate(var(--rot)); opacity:0;} }
        @keyframes saSway{ from{ transform:translateX(-12px) scale(.85); opacity:.55;} to{ transform:translateX(12px) scale(1.2); opacity:1;} }
        @keyframes saDriftA{ from{ transform:translate(0,0) scale(1);} to{ transform:translate(12vw,10vh) scale(1.2);} }
        @keyframes saDriftB{ from{ transform:translate(0,0) scale(1.1);} to{ transform:translate(-10vw,14vh) scale(.9);} }
        @keyframes saDriftC{ from{ transform:translate(0,0) scale(1);} to{ transform:translate(14vw,-10vh) scale(1.25);} }
        @keyframes saDriftD{ from{ transform:translate(0,0) scale(1);} to{ transform:translate(-12vw,-8vh) scale(1.15);} }
        @keyframes saKen{ from{ transform:scale(1.02) translate(0,0);} to{ transform:scale(1.16) translate(-2%,-2%);} }
        @keyframes saSweep{ 0%,55%{ transform:translateX(-130%);} 100%{ transform:translateX(130%);} }
        @keyframes saBar{ to{ height:0;} }
        @keyframes saLeak{ 0%{ transform:translateX(0) rotate(0); opacity:0;} 30%{ opacity:.9;} 100%{ transform:translateX(230%) rotate(6deg); opacity:0;} }
        @keyframes saMarq{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
        @keyframes saSpin{ to{ transform:rotate(360deg);} }
        @keyframes saSpinRev{ to{ transform:rotate(-360deg);} }
        @keyframes saBob{ 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-12px);} }
        @keyframes saPulse{ 0%{ box-shadow:0 0 0 0 color-mix(in srgb,currentColor 55%,transparent);} 70%,100%{ box-shadow:0 0 0 16px transparent;} }
        @keyframes saDash{ to{ stroke-dashoffset:-22;} }
        @keyframes saHalo{ 0%,100%{ transform:scale(.8); opacity:.5;} 50%{ transform:scale(1.35); opacity:1;} }
        @keyframes saRipple{ from{ transform:scale(1); opacity:.9;} to{ transform:scale(5.5); opacity:0;} }
        @keyframes saFly{ from{ transform:translate(-80px,var(--by));} to{ transform:translate(1520px,calc(var(--by) - 70px));} }
        @keyframes saFlap{ from{ transform:scaleY(1);} to{ transform:scaleY(-.6);} }
        @keyframes saSunPulse{ 0%,100%{ transform:scale(1); opacity:.85;} 50%{ transform:scale(1.12); opacity:1;} }
        @keyframes saGrain{ 0%{ transform:translate(0,0);} 20%{ transform:translate(-4%,3%);} 40%{ transform:translate(3%,-5%);} 60%{ transform:translate(-6%,-2%);} 80%{ transform:translate(5%,4%);} 100%{ transform:translate(0,0);} }
        @keyframes saBlink{ 50%{ opacity:.15;} }
        @keyframes saScrollCue{ 0%{ transform:translateY(0); opacity:1;} 100%{ transform:translateY(14px); opacity:0;} }
        @keyframes saDraw{ to{ stroke-dashoffset:0;} }

        /* ===== responsive ===== */
        @media (max-width: 900px){
          .sa-hero{ padding:80px 0 190px; min-height:0; }
          .sa-hero-inner{ grid-template-columns:1fr; gap:48px; padding:0 20px; }
          .sa-hero-visual{ max-width:340px; }
          .sa-chip--a{ left:-8px; } .sa-chip--b{ right:-8px; }
          .sa-story,.sa-story--reverse{ grid-template-columns:1fr; gap:44px; padding:0 20px 90px; }
          .sa-story--reverse .sa-media{ order:-1; }
          .sa-net{ display:none; }
          .sa-values{ grid-template-columns:1fr; padding:0 20px; }
          .sa-values-head,.sa-cta{ padding-left:20px; padding-right:20px; }
          .sa-cta-card{ padding:60px 24px; }
          .sa-mq{ font-size:1.1rem; }
          .sa-p:nth-child(even){ display:none; } /* mobile pe kam particles */
          .sa-scroll{ display:none; }
        }

        /* ===== reduced motion ===== */
        @media (prefers-reduced-motion: reduce){
          .sifi-about *, .sifi-about *::before, .sifi-about *::after{ animation:none !important; transition:none !important; }
          .sa-reveal{ opacity:1 !important; filter:none !important; transform:none !important; }
          .sa-word > span{ transform:none !important; filter:none !important; }
          .sa-hero-copy > *, .sa-hero-visual{ opacity:1 !important; }
          .sa-bar,.sa-particles,.sa-grain,.sa-leak{ display:none; }
          .sa-value-icon svg *{ stroke-dashoffset:0 !important; }
        }
      `}</style>
    </section>
  );
}

/* =========================================================================
   ROUTER
   ========================================================================= */

function SitePage({ path, previewContent }) {
  useSifiFonts();
  const [, section, slug] = path.split("/");

  let content;
  if (slug && section === "blog") {
    content = <DynamicDetailPage key={path} module="blogs" slug={slug} />;
  } else if (path === "/contact" || path === "/reach") {
    content = <ContactPage />;
  } else if (path === "/blog") {
    content = <DynamicContentPage previewContent={previewContent} module="blogs" fallbackPage={newPages["/blog"]} />;
  } else if (path === "/campaigns") {
    content = <Campaigns fullPage />;
  } else if (newPages[path]) {
    content = <NewPage page={newPages[path]} />;
  } else {
    const page = pages[path] || pages["/about-us"];
    if (path === "/about-us" || !pages[path]) {
      content = <AboutPage page={page} />;
    } else {
      content = (
        <section className="site-page">
          <div className="container">
            <div className="page-intro">
              <span>{page.label}</span>
              <h1>{page.title}</h1>
              <p>{page.text}</p>
            </div>
            <div className="page-card-grid">
              {page.cards.map(([title, text], index) => (
                <article key={title} style={{ animationDelay: `${index * 70}ms` }}>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }
  }

  return (
    <div className="sifi-site">
      <SifiGlobalStyle />
      {content}
    </div>
  );
}

export default SitePage;