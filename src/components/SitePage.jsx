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
   ABOUT PAGE — REFINED CINEMATIC EDITION
   Direction: documentary film. Kam colors, dheemi motion, ek yaadgaar moment.
   Palette : night-forest + bone cream + brass, sage aur clay sirf accent me
   Signature: topographic contour lines jo khud draw hoti hain (zameen / community map),
              scroll ke saath jalte statement words, aperture-open hero image
   ========================================================================= */

/* Focus areas — about text me jo areas likhe hain wahi yahan index me aate hain */
const ABOUT_IMAGES = {
  hero: "/images/About.png",
  community: "/images/about1.png",
  work: "/images/about2.png",
  belief: "/images/about3.png",
  fallback: "/images/cover.png",
};

const WORK_AREAS = [
  ["01", "Healthcare & Public Health", "Preventive healthcare, health camps, outreach, nutrition awareness and community health support."],
  ["02", "Education & Digital Learning", "School support, literacy, digital learning, learning centres, scholarships and study materials."],
  ["03", "Skill Development", "Vocational training, employability, entrepreneurship and youth or women-focused skill programmes."],
  ["04", "Livelihood Promotion", "Self-employment, micro-enterprise development, financial literacy and income-generation activities."],
  ["05", "Women & Girl Empowerment", "Education, health, livelihoods, leadership, financial inclusion and community-based empowerment."],
  ["06", "Sustainable Agriculture", "Organic farming, climate-resilient agriculture, farmer training, market linkages and value addition."],
  ["07", "Allied Livelihoods", "Livestock, dairy, fisheries, aquaculture, capacity building and livelihood development."],
  ["08", "Environment & Climate", "Afforestation, biodiversity conservation, ecosystem protection, climate awareness and adaptation."],
  ["09", "Renewable Energy", "Solar awareness, energy efficiency, clean technology demonstrations, research and capacity building."],
  ["10", "WASH & Waste", "Safe drinking water, conservation, sanitation, hygiene, waste management, recycling and cleanliness."],
  ["11", "Rural & Tribal Development", "Community institutions, essential services, local capacity building and participatory development."],
  ["12", "Research & Impact", "Baseline studies, surveys, needs assessments, monitoring, evaluation and social impact assessment."],
  ["13", "Child Welfare", "Education, health, nutrition, protection, learning and community support for children."],
  ["14", "Senior Citizen Welfare", "Dignity, wellbeing, social inclusion and access to essential services for senior citizens."],
  ["15", "Persons with Disabilities", "Inclusion, accessibility, dignity, opportunities and community participation."],
  ["16", "Disaster Response", "Preparedness, relief, rehabilitation and recovery-oriented support during emergencies."],
  ["17", "Digital Inclusion", "Technology for education, healthcare, skills, information, research and community services."],
  ["18", "Sports, Arts & Heritage", "Physical wellbeing, creativity, culture, heritage, traditional knowledge and participation."],
];

const VALUES = [
  ["Dignity", "Human dignity stays at the centre of every programme and partnership."],
  ["Inclusion", "Opportunities must reach underserved, disadvantaged and vulnerable communities."],
  ["Integrity", "Ethical conduct, transparency and responsible stewardship guide our decisions."],
  ["Participation", "We work with communities, not simply for communities."],
  ["Sustainability", "Solutions should create lasting social, economic and environmental value."],
  ["Evidence", "Research, data, community feedback and monitoring improve our work."],
  ["Collaboration", "Complex development challenges need partnerships across sectors."],
  ["Accountability", "Implementation must be responsible, measurable and transparently reported."],
  ["Innovation", "Practical ideas and technology can improve development outcomes."],
];

const APPROACH_STEPS = [
  ["Understand", "Listen to communities and local aspirations."],
  ["Assess", "Use surveys, baseline studies and consultations."],
  ["Design", "Build practical interventions with clear indicators."],
  ["Partner", "Collaborate with government, CSR, NGOs, experts and communities."],
  ["Implement", "Deploy teams, systems and field processes."],
  ["Monitor", "Track activities, quality, beneficiaries and progress."],
  ["Evaluate", "Assess outcomes and learn from implementation."],
  ["Scale", "Strengthen and replicate models that work."],
];

const FRAMEWORK = [
  ["Health", "Accessible healthcare and stronger public-health systems."],
  ["Learn", "Education, literacy and digital learning opportunities."],
  ["Skill", "Skills for employment, enterprise and economic participation."],
  ["Earn", "Sustainable livelihoods and economic empowerment."],
  ["Empower", "Opportunities for women, youth and vulnerable communities."],
  ["Sustain", "Environment, climate action and responsible resource management."],
  ["Research", "Evidence, data and knowledge for better development decisions."],
  ["Partner", "Collaborative action with institutions, CSR partners and communities."],
];

const JOURNEY = [
  ["2017-18", "Beginning of the Social Initiative for India journey."],
  ["Field development", "Community-oriented programmes across healthcare, education, livelihoods and social development."],
  ["Research expansion", "Growth of baseline studies, socio-economic surveys, assessments and project-based implementation."],
  ["Institutional expansion", "Establishment of Social Initiative for India Foundation as a Section 8 company."],
  ["Road ahead", "Building scalable partnerships and integrated development programmes across India."],
];

const LEADERS = [
  ["Mithilesh Pratap Singh", "Managing Director / Director", "Strategic direction, institutional development, partnerships and impact-oriented implementation.", "/images/Mithilesh Pratap Singh, Director.jpeg"],
  ["Madhu Priya Soni", "Director", "Organisational governance, institutional development and programme direction.", ABOUT_IMAGES.fallback],
  ["Kunal Singh Rana", "Director", "Organisational development, programme implementation and strategic growth.", ABOUT_IMAGES.fallback],
];

/* Right side ka chapter rail */
const RAIL = [
  ["sa-ch0", "Overview"],
  ["sa-ch1", "Who we are"],
  ["sa-ch2", "Our work"],
  ["sa-ch3", "Our belief"],
  ["sa-ch4", "Purpose"],
  ["sa-ch5", "Values"],
  ["sa-ch6", "Approach"],
  ["sa-ch7", "People"],
  ["sa-ch8", "Join us"],
];

/* ---------- Contour lines: har ring ka aakar sin waves se thoda tedha-medha ---------- */
function contourPath(cx, cy, R, k) {
  const n = 160;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const w = 1 + 0.09 * Math.sin(3 * t + k * 0.55) + 0.05 * Math.sin(5 * t - k * 0.8) + 0.025 * Math.sin(9 * t + k * 1.3);
    const x = cx + Math.cos(t) * R * w * 1.25;
    const y = cy + Math.sin(t) * R * w * 0.8;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

const CONTOURS = [
  ...Array.from({ length: 16 }, (_, k) => ({ d: contourPath(1180, 380, 38 + k * 34, k), accent: k % 5 === 0 })),
  ...Array.from({ length: 11 }, (_, k) => ({ d: contourPath(260, 820, 30 + k * 40, k + 20), accent: k % 5 === 0 })),
].map((c, i) => ({ ...c, delay: 0.3 + i * 0.09 }));

function ContourField() {
  return (
    <svg className="sa-contours" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="sa-contour-g">
        {CONTOURS.map((c, i) => (
          <path key={i} className={`sa-c${c.accent ? " sa-c--accent" : ""}`} pathLength="1" d={c.d} style={{ animationDelay: `${c.delay}s` }} />
        ))}
      </g>
      {/* location pin — Ranchi ka ishara, ek hi dheema ripple */}
      <circle className="sa-ping" cx="1180" cy="380" r="8" />
      <circle cx="1180" cy="380" r="3.2" fill="#D9A54B" />
    </svg>
  );
}

/* ---------- Dust motes + bokeh: chhote, dheere, kam ---------- */
function makeParticles(count) {
  let seed = 23;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: count }, (_, i) => {
    const bokeh = i % 7 === 0;
    return {
      id: i,
      bokeh,
      left: rnd() * 100,
      size: bokeh ? 28 + rnd() * 40 : 2 + rnd() * 3.5,
      duration: bokeh ? 80 + rnd() * 40 : 44 + rnd() * 40,
      delay: -rnd() * 90, // negative delay: page khulte hi particles pehle se hawa me hon
      drift: (rnd() - 0.5) * 120,
      tone: i % 3,
      twinkle: 4 + rnd() * 5,
    };
  });
}
const PARTICLES = makeParticles(30);

function ParticleField() {
  return (
    <div className="sa-particles">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={`sa-p sa-t${p.tone}${p.bokeh ? " sa-p--bokeh" : ""}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, "--drift": `${p.drift}px` }}
        >
          <svg viewBox="0 0 24 24" style={{ animationDuration: `${p.twinkle}s` }}>
            {p.bokeh ? (
              <>
                <circle cx="12" cy="12" r="11" fill="currentColor" opacity=".09" />
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".4" />
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2" />
                <circle cx="12" cy="12" r="3.4" fill="currentColor" />
              </>
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}

function Kicker({ no, children }) {
  return (
    <p className="sa-kicker">
      <i className="sa-k-line" aria-hidden="true" />
      {no ? <em>{no}</em> : null}
      <span>{children}</span>
    </p>
  );
}

/* Value icons — patli line, reveal hone par ek baar draw hoti hai */
const VALUE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" key="i0"><path pathLength="1" d="M4 17h16M6.5 17a5.5 5.5 0 0 1 11 0" strokeLinecap="round" /><path pathLength="1" d="M12 4v3M6 7l1.8 1.8M18 7l-1.8 1.8" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" key="i1"><circle pathLength="1" cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path pathLength="1" d="M12 2.8v2.4M21.2 12h-2.4" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" key="i2"><path pathLength="1" d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15Z" strokeLinejoin="round" /><path pathLength="1" d="M6 18C9 13 12 10 17 7" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" key="i3"><circle pathLength="1" cx="9" cy="12" r="5.4" /><circle pathLength="1" cx="15" cy="12" r="5.4" /></svg>,
];

const ROMAN = ["I", "II", "III", "IV", "V"];

function SafeImage({ src, alt, className, ...props }) {
  const fallback = ABOUT_IMAGES.fallback;
  return <img className={className} src={src} alt={alt} onError={(event) => { if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback; }} {...props} />;
}

function AboutPage({ page }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(root.querySelectorAll(".sa-w"));
    const statement = root.querySelector(".sa-statement");
    const pars = Array.from(root.querySelectorAll(".sa-par"));
    const railButtons = Array.from(root.querySelectorAll(".sa-rail button"));
    let lastOn = -1;
    let raf = 0;

    /* Ek hi rAF loop: progress, parallax aur statement words teeno yahin update hote hain */
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty("--sy", y.toFixed(1));
      root.style.setProperty("--progress", (max > 0 ? Math.min(1, y / max) : 0).toFixed(4));

      if (!reduce) {
        pars.forEach((el) => {
          const box = el.closest(".sa-photo, .sa-band-media");
          if (!box) return;
          const r = box.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const off = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed || 0.08);
          el.style.translate = `0 ${(-off).toFixed(1)}px`;
        });
      }

      if (statement) {
        const r = statement.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.3 + r.height)));
        const on = reduce ? words.length : Math.round(p * words.length);
        if (on !== lastOn) {
          words.forEach((w, i) => w.classList.toggle("on", i < on));
          lastOn = on;
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    /* Mouse: halki depth (--mx, --my) aur cursor ki dheemi roshni (--cx, --cy) */
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

    /* Reveal: screen me aate hi .is-in */
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    root.querySelectorAll(".sa-reveal").forEach((el) => reveal.observe(el));

    /* Chapter rail: jo section beech screen me ho, uska dot active */
    const chapters = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.dataset.ch);
          railButtons.forEach((b, i) => b.classList.toggle("is-active", i === idx));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    root.querySelectorAll("[data-ch]").forEach((el) => chapters.observe(el));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMove);
      reveal.disconnect();
      chapters.disconnect();
    };
  }, []);

  const go = (id) => rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* Card ke andar cursor ki spotlight */
  const spot = (event) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty("--py", `${event.clientY - r.top}px`);
  };

  const paragraphs = page.text.split("\n\n");
  const statementWords = paragraphs[1].split(" ");

  return (
    <section ref={rootRef} className="sifi-about">
      {/* ---------- fixed backdrop: poore page pe ---------- */}
      <div className="sa-backdrop" aria-hidden="true">
        <div className="sa-blob sa-blob--a" />
        <div className="sa-blob sa-blob--b" />
        <div className="sa-blob sa-blob--c" />
        <ContourField />
        <div className="sa-shaft sa-shaft--1" />
        <div className="sa-shaft sa-shaft--2" />
        <div className="sa-shaft sa-shaft--3" />
        <div className="sa-dusk" />
        <div className="sa-spot" />
        <ParticleField />
      </div>
      <div className="sa-vignette" aria-hidden="true" />
      <div className="sa-grain" aria-hidden="true" />
      <div className="sa-open" aria-hidden="true" />

      <nav className="sa-rail" aria-label="Page sections">
        {RAIL.map(([id, label], i) => (
          <button key={id} type="button" className={i === 0 ? "is-active" : ""} onClick={() => go(id)} aria-label={label}>
            <span>{label}</span><i />
          </button>
        ))}
      </nav>

      {/* ---------------- Overview : hero ---------------- */}
      <div id="sa-ch0" data-ch="0" className="sa-sec sa-hero">
        <Kicker>About SIFI Foundation</Kicker>
        <h1 className="sa-hero-title" aria-label={page.title}>
          {page.title.split(" ").map((word, i) => (
            <span className="sa-word" key={`${word}-${i}`} aria-hidden="true">
              <span style={{ animationDelay: `${0.5 + i * 0.07}s` }}>{word}</span>
            </span>
          ))}
        </h1>

        <div className="sa-hero-row">
          <p className="sa-lead">{paragraphs[0]}</p>
          <div className="sa-actions">
            <a className="sa-btn sa-btn--solid" href="/donate"><span>Support our work</span></a>
            <a className="sa-btn sa-btn--ghost" href="/reach"><span>Get in touch</span></a>
          </div>
        </div>

        <div className="sa-wide">
          <div className="sa-photo sa-photo--wide">
            <SafeImage className="sa-par" data-speed=".08" src={ABOUT_IMAGES.hero} alt="SIFI Foundation working alongside communities" />
            <span className="sa-streak" aria-hidden="true" />
          </div>
        </div>

        <div className="sa-meta">
          <span>Section 8 not-for-profit</span>
          <i aria-hidden="true" />
          <span>Ranchi, Jharkhand</span>
          <b className="sa-scrollcue" aria-hidden="true"><em>Scroll</em><u /></b>
        </div>
      </div>

      {/* ---------------- I : who we are (scroll se jalte words) ---------------- */}
      <div id="sa-ch1" data-ch="1" className="sa-sec sa-who">
        <div className="sa-reveal">
          <Kicker no={ROMAN[0]}>Who we are</Kicker>
        </div>
        <p className="sa-statement" aria-label={paragraphs[1]}>
          {statementWords.map((w, i) => (
            <span key={`${w}-${i}`}>
              <span className="sa-w" aria-hidden="true">{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>

      {/* ---------------- II : our work ---------------- */}
      <div id="sa-ch2" data-ch="2" className="sa-sec sa-work">
        <div className="sa-work-grid">
          <div className="sa-photo sa-photo--tall sa-reveal sa-reveal--clip">
            <SafeImage className="sa-par" data-speed=".07" src={ABOUT_IMAGES.work} alt="SIFI Foundation community-led programmes" />
          </div>
          <div className="sa-work-copy sa-reveal" style={{ "--d": ".2s" }}>
            <Kicker no={ROMAN[1]}>Our work</Kicker>
            <h2>Working with communities to create lasting opportunity</h2>
            <p>{paragraphs[2]}</p>
          </div>
        </div>

        <div className="sa-index-wrap">
          <h3 className="sa-index-title sa-reveal">Focus areas</h3>
          <ul className="sa-index">
            {WORK_AREAS.map(([no, title, text], i) => (
              <li key={title} className="sa-reveal" style={{ "--d": `${(i % 3) * 70 + Math.floor(i / 3) * 45}ms` }}>
                <span><b>{no}</b>{title}</span>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------------- III : belief (full-bleed cinematic band) ---------------- */}
      <div id="sa-ch3" data-ch="3" className="sa-band">
        <div className="sa-band-media">
          <SafeImage className="sa-par" data-speed=".1" src={ABOUT_IMAGES.belief} alt="SIFI Foundation's vision for stronger communities" />
        </div>
        <div className="sa-sec sa-band-inner">
          <div className="sa-band-copy sa-reveal">
            <Kicker no={ROMAN[2]}>Our belief</Kicker>
            <h2>Practical action, measurable solutions</h2>
            <blockquote className="sa-quote">{paragraphs[3]}</blockquote>
          </div>
        </div>
      </div>

      {/* ---------------- IV : purpose / vision / mission ---------------- */}
      <div id="sa-ch4" data-ch="4" className="sa-sec sa-purpose">
        <div className="sa-purpose-grid">
          <div className="sa-purpose-copy sa-reveal">
            <Kicker no={ROMAN[3]}>Our purpose</Kicker>
            <h2>Development that reaches everyday life</h2>
            <p>For us, social impact is about improving access, strengthening capabilities, creating opportunities and enabling communities to become more resilient and self-reliant.</p>
          </div>
          <div className="sa-purpose-cards">
            <article className="sa-purpose-card sa-reveal" onMouseMove={spot}>
              <span className="sa-value-icon">{VALUE_ICONS[1]}</span>
              <h3>Our vision</h3>
              <p>An inclusive and sustainable India where every individual and community has the opportunity to live with health, dignity, knowledge, livelihood security and equal access to opportunities.</p>
            </article>
            <article className="sa-purpose-card sa-reveal" style={{ "--d": "120ms" }} onMouseMove={spot}>
              <span className="sa-value-icon">{VALUE_ICONS[0]}</span>
              <h3>Our mission</h3>
              <p>To improve the quality of life of underserved and vulnerable communities through equitable access to healthcare, education, livelihoods, skills, technology, essential services and sustainable development opportunities.</p>
            </article>
          </div>
        </div>
      </div>

      {/* ---------------- V : what guides us (values) ---------------- */}
      <div id="sa-ch5" data-ch="5" className="sa-sec sa-guide">
        <div className="sa-reveal">
          <Kicker no={ROMAN[4]}>What guides us</Kicker>
          <h2 className="sa-guide-title">People, progress and possibilities</h2>
        </div>
        <div className="sa-bento">
          {VALUES.map(([title, text], index) => (
            <div className={`sa-cell sa-cell--${index} sa-reveal`} key={title} style={{ "--d": `${index * 120}ms` }}>
              <article className={`sa-value sa-value--${index % 4}`} onMouseMove={spot}>
                <span className="sa-value-icon">{VALUE_ICONS[index % VALUE_ICONS.length]}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- VI : approach / framework ---------------- */}
      <div id="sa-ch6" data-ch="6" className="sa-sec sa-process">
        <div className="sa-reveal">
          <Kicker>Our approach</Kicker>
          <h2 className="sa-guide-title">From community needs to sustainable solutions</h2>
        </div>
        <div className="sa-process-grid">
          {APPROACH_STEPS.map(([title, text], index) => (
            <article key={title} className="sa-process-step sa-reveal" style={{ "--d": `${index * 70}ms` }}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="sa-framework sa-reveal">
          {FRAMEWORK.map(([title, text], index) => (
            <article key={title} className="sa-framework-card" style={{ "--d": `${index * 55}ms` }}>
              <span>{title}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ---------------- VII : journey / leadership ---------------- */}
      <div id="sa-ch7" data-ch="7" className="sa-sec sa-people">
        <div className="sa-people-grid">
          <div className="sa-reveal">
            <Kicker>Our journey</Kicker>
            <h2 className="sa-guide-title">From social initiative to stronger institutional platform</h2>
            <div className="sa-timeline">
              {JOURNEY.map(([year, text], index) => (
                <article key={year} className="sa-timeline-item" style={{ "--d": `${index * 90}ms` }}>
                  <b>{year}</b>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="sa-reveal" style={{ "--d": "180ms" }}>
            <Kicker>Leadership</Kicker>
            <div className="sa-leaders">
              {LEADERS.map(([name, role, text, image]) => (
                <article key={name} className="sa-leader-card">
                  <SafeImage src={image} alt={name} />
                  <div>
                    <h3>{name}</h3>
                    <b>{role}</b>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- VIII : join us ---------------- */}
      <div id="sa-ch8" data-ch="8" className="sa-sec sa-cta">
        <div className="sa-cta-grid sa-reveal">
          <div>
            <Kicker>Join us</Kicker>
            <h2>Build lasting opportunity with us</h2>
          </div>
          <div className="sa-cta-side">
            <p>Support our work, volunteer your time or explore a partnership with SIFI Foundation.</p>
            <div className="sa-actions">
              <a className="sa-btn sa-btn--solid" href="/donate"><span>Donate</span></a>
              <a className="sa-btn sa-btn--ghost" href="/volunteer"><span>Volunteer</span></a>
              <a className="sa-btn sa-btn--ghost" href="/reach"><span>Start a partnership</span></a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sifi-about{
          --sa-night:#07110E;
          --sa-cream:#F3EBDB;
          --sa-brass:#D9A54B;
          --sa-sage:#86B8A7;
          --sa-clay:#C9704F;
          --sa-mist:rgba(243,235,219,.74);
          --sa-line:rgba(243,235,219,.14);
          --sa-ease:cubic-bezier(.2,.75,.2,1);
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
          padding-bottom:120px;
        }
        .sifi-about *{ box-sizing:border-box; }
        .sifi-about h1,.sifi-about h2,.sifi-about h3{ font-family:"Fraunces", serif; font-weight:500; letter-spacing:-0.015em; margin:0; color:var(--sa-cream); }
        .sifi-about p{ margin:0; }
        .sifi-about ::selection{ background:var(--sa-brass); color:#1A120A; }
        .sa-sec{ position:relative; z-index:2; max-width:1240px; margin:0 auto; padding:0 40px; }

        /* ===== backdrop ===== */
        .sa-backdrop{ position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
          background:linear-gradient(180deg,#07110E 0%,#0B1A16 40%,#101614 72%,#15100E 100%); }
        .sa-blob{ position:absolute; border-radius:50%; filter:blur(120px); }
        .sa-blob--a{ width:52vw; height:52vw; left:-18vw; top:-18vw; background:radial-gradient(circle,var(--sa-sage),transparent 65%); opacity:.2; animation:saBlob 42s ease-in-out infinite alternate; }
        .sa-blob--b{ width:44vw; height:44vw; right:-14vw; top:8vh; background:radial-gradient(circle,var(--sa-brass),transparent 65%); opacity:.16; animation:saBlob 50s ease-in-out infinite alternate-reverse; }
        .sa-blob--c{ width:46vw; height:46vw; left:10vw; bottom:-24vw; background:radial-gradient(circle,var(--sa-clay),transparent 65%); opacity:.15; animation:saBlob 46s ease-in-out infinite alternate; }
        .sa-dusk{ position:absolute; inset:0; background:linear-gradient(180deg,transparent 20%,rgba(201,112,79,.14) 70%,rgba(124,92,250,.10)); opacity:calc(var(--progress) * 1.2); }
        .sa-spot{ position:absolute; inset:0; background:radial-gradient(460px circle at var(--cx,50%) var(--cy,30%),rgba(217,165,75,.07),transparent 62%); }

        .sa-contours{ position:absolute; inset:0; width:100%; height:100%; translate:0 calc(var(--sy) * -.04px); }
        .sa-contour-g{ transform-origin:800px 500px; animation:saBreath 80s ease-in-out infinite alternate; }
        .sa-c{ fill:none; stroke:rgba(243,235,219,.09); stroke-width:1.1; stroke-dasharray:1; stroke-dashoffset:1; animation:saDrawLine 3.8s cubic-bezier(.4,0,.2,1) forwards; }
        .sa-c--accent{ stroke:rgba(217,165,75,.24); }
        .sa-ping{ fill:none; stroke:var(--sa-brass); stroke-width:1; transform-box:fill-box; transform-origin:center; animation:saPing 5s ease-out infinite 3s; opacity:0; }

        .sa-shaft{ position:absolute; top:-25%; height:160%; width:16vw; filter:blur(34px); mix-blend-mode:screen; transform:rotate(19deg); background:linear-gradient(180deg,rgba(217,165,75,.15),transparent 72%); animation:saShaft 20s ease-in-out infinite alternate; }
        .sa-shaft--1{ left:52%; } .sa-shaft--2{ left:66%; width:9vw; animation-delay:-7s; opacity:.8; } .sa-shaft--3{ left:82%; width:12vw; animation-delay:-13s; opacity:.6; }

        .sa-particles{ position:absolute; inset:0; translate:calc(var(--mx) * -18px) calc(var(--my) * -12px); transition:translate .4s ease-out; }
        .sa-p{ position:absolute; bottom:-60px; display:block; opacity:0; animation:saRise linear infinite; will-change:transform,opacity; }
        .sa-p svg{ width:100%; height:100%; display:block; overflow:visible; animation:saTwinkle ease-in-out infinite alternate; }
        .sa-p--bokeh svg{ filter:blur(1.5px); }
        .sa-t0{ color:var(--sa-brass); } .sa-t1{ color:var(--sa-cream); } .sa-t2{ color:var(--sa-sage); }

        /* ===== film overlays ===== */
        .sa-vignette{ position:fixed; inset:0; z-index:14; pointer-events:none; background:radial-gradient(130% 105% at 50% 45%,transparent 60%,rgba(0,0,0,.5)); }
        .sa-grain{ position:fixed; inset:-50%; width:200%; height:200%; z-index:15; pointer-events:none; opacity:.06; mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.6'/></svg>");
          animation:saGrain 1s steps(6) infinite; }
        .sa-open{ position:fixed; inset:0; z-index:30; background:#000; pointer-events:none; animation:saFadeOpen 1.6s ease .1s forwards; }

        /* ===== chapter rail ===== */
        .sa-rail{ position:fixed; right:22px; top:50%; translate:0 -50%; z-index:12; display:flex; flex-direction:column; gap:20px; padding:6px 0; }
        .sa-rail::before,.sa-rail::after{ content:""; position:absolute; right:5px; top:0; bottom:0; width:1px; }
        .sa-rail::before{ background:var(--sa-line); }
        .sa-rail::after{ background:var(--sa-brass); transform-origin:top; transform:scaleY(var(--progress)); }
        .sa-rail button{ position:relative; display:flex; align-items:center; justify-content:flex-end; gap:14px; padding:0; border:0; background:none; cursor:pointer; color:var(--sa-cream); }
        .sa-rail button span{ font-size:.78rem; opacity:0; transform:translateX(6px); transition:opacity .35s ease, transform .35s ease; white-space:nowrap; }
        .sa-rail button i{ position:relative; z-index:1; width:11px; height:11px; border-radius:50%; background:var(--sa-night); border:1px solid rgba(243,235,219,.4); transition:background .4s ease, border-color .4s ease, transform .4s ease; }
        .sa-rail button:hover span,.sa-rail button:focus-visible span,.sa-rail button.is-active span{ opacity:.9; transform:none; }
        .sa-rail button.is-active i{ background:var(--sa-brass); border-color:var(--sa-brass); transform:scale(1.15); }
        .sa-rail button:focus-visible{ outline:2px solid var(--sa-brass); outline-offset:4px; }

        /* ===== shared ===== */
        .sa-kicker{ display:flex; align-items:center; gap:14px; margin-bottom:26px; font-size:.9rem; letter-spacing:.03em; color:var(--sa-brass); font-weight:500; }
        .sa-k-line{ display:block; width:38px; height:1px; background:var(--sa-brass); flex:none; }
        .sa-kicker em{ font-family:"Fraunces",serif; font-style:italic; font-size:1.05rem; color:var(--sa-cream); opacity:.85; }

        .sa-btn{ position:relative; display:inline-flex; align-items:center; justify-content:center; padding:15px 30px; border-radius:2px; font-weight:600; font-size:.93rem; letter-spacing:.01em; text-decoration:none; overflow:hidden; isolation:isolate; transition:color .45s var(--sa-ease), border-color .45s ease; }
        .sa-btn::before{ content:""; position:absolute; inset:0; z-index:-1; transform:translateX(-101%); transition:transform .55s var(--sa-ease); }
        .sa-btn:hover::before{ transform:none; }
        .sa-btn:focus-visible{ outline:2px solid var(--sa-cream); outline-offset:4px; }
        .sa-btn--solid{ background:var(--sa-brass); color:#1A120A; }
        .sa-btn--solid::before{ background:var(--sa-cream); }
        .sa-btn--ghost{ color:var(--sa-cream); border:1px solid rgba(243,235,219,.3); }
        .sa-btn--ghost::before{ background:rgba(243,235,219,.12); }
        .sa-btn--ghost:hover{ border-color:var(--sa-cream); }
        .sa-actions{ display:flex; flex-wrap:wrap; gap:12px; }

        .sa-reveal{ opacity:0; transform:translateY(26px); transition:opacity 1.2s var(--sa-ease) var(--d,0s), transform 1.4s var(--sa-ease) var(--d,0s); }
        .sa-reveal.is-in{ opacity:1; transform:none; }
        .sa-reveal--clip{ opacity:1; transform:none; clip-path:inset(100% 0 0 0); transition:clip-path 1.6s cubic-bezier(.77,0,.18,1) var(--d,0s); }
        .sa-reveal--clip.is-in{ clip-path:inset(0 0 0 0); }

        .sa-photo{ position:relative; overflow:hidden; background:#000; }
        .sa-photo img,.sa-band-media img{ position:absolute; left:0; top:-12%; width:100%; height:124%; object-fit:cover; display:block; filter:saturate(1.05) contrast(1.05); animation:saKen 30s ease-in-out infinite alternate; }
        .sa-photo::before{ content:""; position:absolute; inset:0; z-index:1; pointer-events:none;
          background:radial-gradient(120% 90% at 50% 40%,transparent 55%,rgba(0,0,0,.45)), linear-gradient(160deg,rgba(134,184,167,.16),transparent 50%,rgba(201,112,79,.18)); }

        /* ===== hero ===== */
        .sa-hero{ padding-top:128px; padding-bottom:40px; }
        .sa-hero > .sa-kicker{ opacity:0; animation:saFade 1.2s ease 1s forwards; }
        .sa-hero-title{ max-width:15em; font-size:clamp(2.5rem,6vw,5.1rem); line-height:1.05; font-weight:500; }
        .sa-word{ display:inline-block; overflow:hidden; vertical-align:top; padding:0 .04em .12em; margin-right:.22em; }
        .sa-word > span{ display:inline-block; transform:translateY(112%); animation:saWordUp 1.3s cubic-bezier(.16,.84,.24,1) forwards; }
        .sa-hero-row{ display:grid; grid-template-columns:1.15fr .85fr; gap:64px; align-items:end; margin-top:44px; opacity:0; animation:saFade 1.4s ease 1.7s forwards; }
        .sa-lead{ max-width:52ch; font-size:1.08rem; line-height:1.85; color:var(--sa-mist); }
        .sa-hero-row .sa-actions{ justify-content:flex-end; }

        .sa-wide{ margin-top:72px; clip-path:inset(0 50% 0 50%); animation:saAperture 1.9s cubic-bezier(.77,0,.18,1) 1.5s forwards; }
        .sa-photo--wide{ aspect-ratio:21/9; border:1px solid var(--sa-line); box-shadow:0 50px 90px -40px rgba(0,0,0,.85); }
        .sa-streak{ position:absolute; left:0; right:0; top:50%; height:2px; z-index:2; pointer-events:none; transform:scaleX(0);
          background:linear-gradient(90deg,transparent,rgba(255,236,196,.95),transparent); box-shadow:0 0 22px 4px rgba(217,165,75,.5); animation:saStreak 2.6s cubic-bezier(.5,0,.2,1) 2.7s forwards; }
        .sa-meta{ display:flex; align-items:center; gap:18px; margin-top:22px; font-size:.86rem; color:rgba(243,235,219,.68); opacity:0; animation:saFade 1.2s ease 3s forwards; }
        .sa-meta > i{ width:1px; height:14px; background:var(--sa-line); }
        .sa-scrollcue{ margin-left:auto; display:flex; align-items:center; gap:12px; font-weight:400; }
        .sa-scrollcue em{ font-style:normal; }
        .sa-scrollcue u{ position:relative; width:46px; height:1px; background:var(--sa-line); overflow:hidden; text-decoration:none; }
        .sa-scrollcue u::after{ content:""; position:absolute; inset:0; background:var(--sa-brass); transform:translateX(-100%); animation:saScrollLine 3s ease-in-out infinite; }

        /* ===== I : who we are ===== */
        .sa-who{ padding-top:180px; padding-bottom:170px; }
        .sa-statement{ max-width:24em; font-family:"Fraunces",serif; font-weight:400; font-size:clamp(1.7rem,3.3vw,2.85rem); line-height:1.32; letter-spacing:-.012em; }
        .sa-w{ color:rgba(243,235,219,.17); transition:color .7s ease; }
        .sa-w.on{ color:var(--sa-cream); }

        /* ===== II : our work ===== */
        .sa-work{ padding-bottom:170px; }
        .sa-work-grid{ display:grid; grid-template-columns:5fr 6fr; gap:clamp(48px,8vw,120px); align-items:center; }
        .sa-photo--tall{ aspect-ratio:4/5; border:1px solid var(--sa-line); box-shadow:0 50px 90px -40px rgba(0,0,0,.85); }
        .sa-work-copy h2{ font-size:clamp(1.9rem,3.3vw,2.8rem); line-height:1.15; margin-bottom:26px; }
        .sa-work-copy > p{ max-width:52ch; line-height:1.9; color:var(--sa-mist); }
        .sa-index-wrap{ margin-top:120px; }
        .sa-index-title{ font-size:1.15rem; margin-bottom:22px; color:var(--sa-brass); font-weight:500; }
        .sa-index{ list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--sa-line); border:1px solid var(--sa-line); }
        .sa-index li{ position:relative; min-height:178px; padding:22px; background:rgba(243,235,219,.035); overflow:hidden; }
        .sa-index li::after{ content:""; position:absolute; left:0; top:0; height:3px; width:100%; background:var(--sa-brass); transform:scaleX(0); transform-origin:left; transition:transform .7s var(--sa-ease); }
        .sa-index li:hover::after{ transform:scaleX(1); }
        .sa-index li span{ display:block; font-family:"Fraunces",serif; font-size:1.14rem; line-height:1.2; color:var(--sa-cream); transition:color .4s ease, transform .6s var(--sa-ease); }
        .sa-index li b{ display:block; margin-bottom:12px; color:var(--sa-brass); font:600 .72rem/1 "Work Sans", sans-serif; letter-spacing:.08em; }
        .sa-index li p{ margin-top:13px; color:rgba(243,235,219,.66); font-size:.86rem; line-height:1.62; }
        .sa-index li:hover span{ color:var(--sa-cream); transform:translateX(10px); }

        /* ===== III : belief band ===== */
        .sa-band{ position:relative; z-index:2; min-height:min(88vh,780px); display:flex; align-items:center; margin-bottom:170px; }
        .sa-band-media{ position:absolute; inset:0; overflow:hidden; -webkit-mask-image:linear-gradient(180deg,transparent,#000 18%,#000 82%,transparent); mask-image:linear-gradient(180deg,transparent,#000 18%,#000 82%,transparent); }
        .sa-band-media::after{ content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(7,17,14,.94) 5%,rgba(7,17,14,.72) 45%,rgba(7,17,14,.2) 100%), linear-gradient(160deg,rgba(134,184,167,.14),transparent 50%,rgba(201,112,79,.2)); }
        .sa-band-inner{ width:100%; padding-top:110px; padding-bottom:110px; }
        .sa-band-copy{ max-width:640px; }
        .sa-band-copy h2{ font-size:clamp(1.9rem,3.6vw,3rem); line-height:1.12; margin-bottom:32px; }
        .sa-quote{ margin:0; padding-left:26px; border-left:1px solid var(--sa-brass); font-family:"Fraunces",serif; font-weight:400; font-size:clamp(1.15rem,1.7vw,1.4rem); line-height:1.7; color:var(--sa-cream); }

        /* ===== IV : purpose ===== */
        .sa-purpose{ padding-bottom:170px; }
        .sa-purpose-grid{ display:grid; grid-template-columns:.85fr 1.15fr; gap:64px; align-items:start; }
        .sa-purpose-copy h2{ font-size:clamp(1.9rem,3.3vw,2.8rem); line-height:1.15; margin-bottom:24px; }
        .sa-purpose-copy p{ max-width:42ch; line-height:1.85; color:var(--sa-mist); }
        .sa-purpose-cards{ display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .sa-purpose-card{ --vc:var(--sa-brass); position:relative; min-height:360px; padding:38px 34px; border:1px solid var(--sa-line); background:rgba(243,235,219,.04); overflow:hidden; }
        .sa-purpose-card:nth-child(2){ --vc:var(--sa-sage); }
        .sa-purpose-card::before{ content:""; position:absolute; inset:0; opacity:.85; background:radial-gradient(340px circle at var(--px,50%) var(--py,50%),color-mix(in srgb,var(--vc) 18%,transparent),transparent 68%); }
        .sa-purpose-card > *{ position:relative; }
        .sa-purpose-card h3{ font-size:clamp(1.6rem,2.6vw,2.2rem); margin-bottom:18px; }
        .sa-purpose-card p{ color:var(--sa-mist); line-height:1.78; }

        /* ===== IV : bento ===== */
        .sa-guide{ padding-bottom:0; }
        .sa-guide-title{ font-size:clamp(1.9rem,3.3vw,2.8rem); line-height:1.15; max-width:18ch; margin-bottom:52px; }
        .sa-bento{ display:grid; grid-template-columns:repeat(12,1fr); gap:20px; }
        .sa-cell--0{ grid-column:1 / span 6; grid-row:1 / span 2; }
        .sa-cell--1{ grid-column:7 / span 6; }
        .sa-cell--2{ grid-column:7 / span 3; }
        .sa-cell--3{ grid-column:10 / span 3; }
        .sa-cell--4{ grid-column:1 / span 3; }
        .sa-cell--5{ grid-column:4 / span 3; }
        .sa-cell--6{ grid-column:7 / span 3; }
        .sa-cell--7{ grid-column:10 / span 3; }
        .sa-cell--8{ grid-column:1 / span 12; }
        .sa-value{ --vc:var(--sa-brass); position:relative; height:100%; overflow:hidden; padding:40px 36px; border-radius:3px; border:1px solid var(--sa-line); background:rgba(243,235,219,.035); backdrop-filter:blur(12px); transition:border-color .5s ease, background .5s ease; }
        .sa-value--1{ --vc:var(--sa-sage); } .sa-value--2{ --vc:var(--sa-clay); } .sa-value--3{ --vc:#B3A6F5; }
        .sa-value::before{ content:""; position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .5s ease; background:radial-gradient(320px circle at var(--px,50%) var(--py,50%),color-mix(in srgb,var(--vc) 20%,transparent),transparent 65%); }
        .sa-value::after{ content:""; position:absolute; left:0; top:0; width:100%; height:2px; background:var(--vc); transform:scaleX(0); transform-origin:left; transition:transform .8s var(--sa-ease); }
        .sa-value:hover{ border-color:color-mix(in srgb,var(--vc) 55%,transparent); background:rgba(243,235,219,.05); }
        .sa-value:hover::before{ opacity:1; }
        .sa-value:hover::after{ transform:scaleX(1); }
        .sa-value > *{ position:relative; }
        .sa-value-icon{ display:inline-flex; width:44px; height:44px; margin-bottom:26px; color:var(--vc); }
        .sa-value-icon svg{ width:100%; height:100%; }
        .sa-value-icon svg *{ stroke-dasharray:1; stroke-dashoffset:1; transition:stroke-dashoffset 2s var(--sa-ease) .4s; }
        .is-in .sa-value-icon svg *{ stroke-dashoffset:0; }
        .sa-value h3{ font-size:1.3rem; margin-bottom:14px; }
        .sa-value p{ line-height:1.8; color:var(--sa-mist); font-size:.96rem; }
        .sa-value--0{ display:flex; flex-direction:column; justify-content:flex-end; min-height:420px; }
        .sa-value--0 .sa-value-icon{ width:64px; height:64px; margin-bottom:auto; }
        .sa-value--0 h3{ font-size:clamp(1.8rem,2.8vw,2.4rem); }
        .sa-value--0 p{ font-family:"Fraunces",serif; font-size:clamp(1.1rem,1.6vw,1.35rem); line-height:1.6; max-width:28em; }

        /* ===== VI : approach / framework ===== */
        .sa-process{ padding-top:170px; padding-bottom:170px; }
        .sa-process-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--sa-line); border:1px solid var(--sa-line); }
        .sa-process-step{ min-height:210px; padding:28px 24px; background:rgba(243,235,219,.035); }
        .sa-process-step b{ color:var(--sa-brass); font-size:.8rem; letter-spacing:.1em; }
        .sa-process-step h3{ margin:20px 0 12px; font-size:1.35rem; }
        .sa-process-step p{ color:var(--sa-mist); line-height:1.65; font-size:.93rem; }
        .sa-framework{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:42px; }
        .sa-framework-card{ position:relative; padding:24px 22px; border:1px solid var(--sa-line); background:linear-gradient(145deg,rgba(217,165,75,.09),rgba(134,184,167,.045)); overflow:hidden; }
        .sa-framework-card::before{ content:""; position:absolute; inset:auto 18px 0; height:2px; background:var(--sa-brass); transform:scaleX(0); transform-origin:left; animation:saFrameLine 2.2s var(--sa-ease) var(--d,0s) infinite alternate; }
        .sa-framework-card span{ display:block; color:var(--sa-brass); font:600 1rem/1 "Fraunces",serif; text-transform:uppercase; letter-spacing:.06em; margin-bottom:11px; }
        .sa-framework-card p{ color:rgba(243,235,219,.72); line-height:1.6; font-size:.86rem; }

        /* ===== VII : journey / leadership ===== */
        .sa-people{ padding-bottom:0; }
        .sa-people-grid{ display:grid; grid-template-columns:.95fr 1.05fr; gap:64px; align-items:start; }
        .sa-timeline{ position:relative; display:grid; gap:18px; }
        .sa-timeline::before{ content:""; position:absolute; left:8px; top:4px; bottom:4px; width:1px; background:var(--sa-line); }
        .sa-timeline-item{ position:relative; padding-left:36px; }
        .sa-timeline-item::before{ content:""; position:absolute; left:3px; top:7px; width:11px; height:11px; border-radius:50%; background:var(--sa-night); border:1px solid var(--sa-brass); box-shadow:0 0 0 0 rgba(217,165,75,.25); animation:saDotPulse 3.4s ease-in-out infinite; }
        .sa-timeline-item b{ display:block; color:var(--sa-brass); font-size:.88rem; margin-bottom:7px; }
        .sa-timeline-item p{ color:var(--sa-mist); line-height:1.65; }
        .sa-leaders{ display:grid; gap:16px; }
        .sa-leader-card{ display:grid; grid-template-columns:86px 1fr; gap:18px; align-items:center; padding:18px; border:1px solid var(--sa-line); background:rgba(243,235,219,.035); transition:transform .45s var(--sa-ease), border-color .45s ease; }
        .sa-leader-card:hover{ transform:translateX(8px); border-color:rgba(217,165,75,.55); }
        .sa-leader-card img{ width:86px; height:86px; object-fit:cover; border:1px solid var(--sa-line); filter:saturate(1.02) contrast(1.02); }
        .sa-leader-card h3{ font-size:1.22rem; margin-bottom:4px; }
        .sa-leader-card b{ display:block; color:var(--sa-brass); font-size:.82rem; margin-bottom:8px; }
        .sa-leader-card p{ color:rgba(243,235,219,.72); line-height:1.55; font-size:.9rem; }

        /* ===== VIII : cta ===== */
        .sa-cta{ padding-top:170px; }
        .sa-cta-grid{ display:grid; grid-template-columns:1.2fr .8fr; gap:72px; align-items:end; padding:72px 0 0; border-top:1px solid var(--sa-line); }
        .sa-cta h2{ font-size:clamp(2.2rem,4.8vw,4rem); line-height:1.08; max-width:12em; }
        .sa-cta-side p{ max-width:40ch; line-height:1.85; color:var(--sa-mist); margin-bottom:30px; }

        /* ===== keyframes ===== */
        @keyframes saFadeOpen{ to{ opacity:0; visibility:hidden; } }
        @keyframes saFade{ from{ opacity:0; transform:translateY(14px);} to{ opacity:1; transform:none;} }
        @keyframes saWordUp{ to{ transform:translateY(0);} }
        @keyframes saAperture{ to{ clip-path:inset(0 0 0 0);} }
        @keyframes saStreak{ 0%{ transform:scaleX(0); opacity:1;} 55%{ transform:scaleX(1); opacity:1;} 100%{ transform:scaleX(1); opacity:0;} }
        @keyframes saKen{ from{ transform:scale(1.02);} to{ transform:scale(1.12);} }
        @keyframes saDrawLine{ to{ stroke-dashoffset:0;} }
        @keyframes saBreath{ from{ transform:scale(1) rotate(-1.2deg);} to{ transform:scale(1.06) rotate(1.2deg);} }
        @keyframes saPing{ 0%{ transform:scale(1); opacity:.7;} 100%{ transform:scale(7); opacity:0;} }
        @keyframes saBlob{ from{ transform:translate(0,0) scale(1);} to{ transform:translate(8vw,6vh) scale(1.15);} }
        @keyframes saShaft{ from{ transform:rotate(19deg) translateX(0); opacity:.55;} to{ transform:rotate(15deg) translateX(-4vw); opacity:1;} }
        @keyframes saRise{ 0%{ transform:translate3d(0,0,0); opacity:0;} 12%{ opacity:.85;} 88%{ opacity:.7;} 100%{ transform:translate3d(var(--drift),-118vh,0); opacity:0;} }
        @keyframes saTwinkle{ from{ opacity:.4; transform:scale(.9);} to{ opacity:1; transform:scale(1.1);} }
        @keyframes saGrain{ 0%{ transform:translate(0,0);} 20%{ transform:translate(-4%,3%);} 40%{ transform:translate(3%,-5%);} 60%{ transform:translate(-6%,-2%);} 80%{ transform:translate(5%,4%);} 100%{ transform:translate(0,0);} }
        @keyframes saScrollLine{ 0%{ transform:translateX(-100%);} 60%,100%{ transform:translateX(100%);} }
        @keyframes saFrameLine{ to{ transform:scaleX(1); opacity:.35;} }
        @keyframes saDotPulse{ 50%{ box-shadow:0 0 0 8px rgba(217,165,75,.08); } }

        /* ===== responsive ===== */
        @media (max-width: 1180px){ .sa-rail{ display:none; } }
        @media (max-width: 900px){
          .sa-sec{ padding:0 22px; }
          .sa-hero{ padding-top:84px; }
          .sa-hero-row{ grid-template-columns:1fr; gap:30px; }
          .sa-hero-row .sa-actions{ justify-content:flex-start; }
          .sa-photo--wide{ aspect-ratio:4/3; }
          .sa-wide{ margin-top:52px; }
          .sa-who{ padding-top:120px; padding-bottom:110px; }
          .sa-work-grid{ grid-template-columns:1fr; gap:44px; }
          .sa-index-wrap{ margin-top:80px; }
          .sa-index{ grid-template-columns:1fr; }
          .sa-band{ margin-bottom:110px; }
          .sa-band-media::after{ background:linear-gradient(180deg,rgba(7,17,14,.82),rgba(7,17,14,.7)); }
          .sa-purpose{ padding-bottom:110px; }
          .sa-purpose-grid,.sa-purpose-cards{ grid-template-columns:1fr; gap:24px; }
          .sa-purpose-card{ min-height:0; }
          .sa-bento{ grid-template-columns:1fr; }
          .sa-cell--0,.sa-cell--1,.sa-cell--2,.sa-cell--3,.sa-cell--4,.sa-cell--5,.sa-cell--6,.sa-cell--7,.sa-cell--8{ grid-column:1; grid-row:auto; }
          .sa-value--0{ min-height:0; }
          .sa-value--0 .sa-value-icon{ margin-bottom:28px; }
          .sa-process{ padding-top:110px; padding-bottom:110px; }
          .sa-process-grid,.sa-framework{ grid-template-columns:1fr; }
          .sa-people-grid{ grid-template-columns:1fr; gap:58px; }
          .sa-cta{ padding-top:110px; }
          .sa-cta-grid{ grid-template-columns:1fr; gap:36px; padding-top:48px; }
          .sa-p:nth-child(even){ display:none; }
          .sa-scrollcue{ display:none; }
          .sa-shaft{ display:none; }
        }

        /* ===== reduced motion ===== */
        @media (prefers-reduced-motion: reduce){
          .sifi-about *, .sifi-about *::before, .sifi-about *::after{ animation:none !important; transition:none !important; }
          .sa-reveal{ opacity:1 !important; transform:none !important; clip-path:none !important; }
          .sa-word > span{ transform:none !important; }
          .sa-hero > .sa-kicker,.sa-hero-row,.sa-meta{ opacity:1 !important; }
          .sa-wide{ clip-path:none !important; }
          .sa-c{ stroke-dashoffset:0 !important; }
          .sa-value-icon svg *{ stroke-dashoffset:0 !important; }
          .sa-open,.sa-streak,.sa-particles,.sa-grain,.sa-shaft{ display:none; }
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
