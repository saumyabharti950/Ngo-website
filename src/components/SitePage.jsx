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
   ABOUT PAGE
   ========================================================================= */

const VALUE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i0"><path d="M4 17h16M6.5 17a5.5 5.5 0 0 1 11 0" strokeLinecap="round" /><path d="M12 4v3M6 7l1.8 1.8M18 7l-1.8 1.8" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i1"><circle cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path d="M12 2.8v2.4M21.2 12h-2.4" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i2"><path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15Z" strokeLinejoin="round" /><path d="M6 18C9 13 12 10 17 7" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i3"><circle cx="9" cy="12" r="5.4" /><circle cx="15" cy="12" r="5.4" /></svg>,
];

function AboutPage({ page }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const items = rootRef.current?.querySelectorAll(".sa-reveal");
    if (!items || items.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const paragraphs = page.text.split("\n\n");

  return (
    <section ref={rootRef} className="sifi-about">
      {/* ---------------- hero ---------------- */}
      <div className="sa-hero">
        <div className="sa-hero-copy">
          <p className="sa-kicker"><span className="sa-kicker-dot" aria-hidden="true" />{page.label}</p>
          <div className="sa-title-mask">
            <h1 className="sa-hero-title">{page.title}</h1>
          </div>
          <p className="sa-lead">{paragraphs[0]}</p>
          <a className="sa-link" href="/donate">
            <span>Support our work</span>
          </a>
        </div>

        <div className="sa-hero-visual sa-reveal sa-reveal--pop">
          <div className="sa-frame sa-frame--hero">
            <img src="/images/about1.png" alt="SIFI Foundation working alongside communities" />
          </div>
          <div className="sa-hero-caption">
            <span>Section 8 not-for-profit</span>
            <i aria-hidden="true" />
            <span>Ranchi, Jharkhand</span>
          </div>
        </div>
      </div>

      {/* ---------------- approach ---------------- */}
      <div className="sa-story sa-reveal sa-reveal--left">
        <div className="sa-frame sa-frame--sage">
          <img className="sa-photo" src="/images/about2.png" alt="SIFI Foundation community-led programmes" />
        </div>
        <div className="sa-story-copy">
          <p className="sa-kicker"><span className="sa-kicker-dot" aria-hidden="true" />Our approach</p>
          <h2>Working with communities to create lasting opportunity</h2>
          <p>{paragraphs[1]}</p>
          <p>{paragraphs[2]}</p>
        </div>
      </div>

      {/* ---------------- belief ---------------- */}
      <div className="sa-story sa-story--reverse sa-reveal sa-reveal--right">
        <div className="sa-story-copy">
          <p className="sa-kicker"><span className="sa-kicker-dot" aria-hidden="true" />Our belief</p>
          <h2>Practical action, measurable solutions</h2>
          <p>{paragraphs[3]}</p>
        </div>
        <div className="sa-frame sa-frame--clay">
          <img className="sa-photo" src="/images/about3.png" alt="SIFI Foundation's vision for stronger communities" />
        </div>
      </div>

      {/* ---------------- what guides us ---------------- */}
      <div className="sa-values-head sa-reveal sa-reveal--fade">
        <p className="sa-kicker"><span className="sa-kicker-dot" aria-hidden="true" />What guides us</p>
        <h2>People, progress and possibilities</h2>
      </div>
      <div className="sa-values">
        {page.cards.map(([title, text], index) => (
          <article
            className="sa-value sa-reveal sa-reveal--fade"
            key={title}
            style={{ "--sa-delay": `${index * 100}ms` }}
          >
            <span className="sa-value-icon">{VALUE_ICONS[index % VALUE_ICONS.length]}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <style>{`
        .sifi-about{
          --sa-ink:#17231C;
          --sa-paper:#FBF7EF;
          --sa-paper-deep:#F0E8D8;
          --sa-sage-tint:#E5EEE6;
          --sa-clay-tint:#F1E0D2;
          --sa-gold:#C67F17;
          box-sizing:border-box;
          max-width:100vw;
          position:relative;
          background:var(--sa-paper);
          color:var(--sa-ink);
          font-family:"Work Sans", sans-serif;
          overflow-x:hidden;
          padding-bottom:100px;
        }
        .sifi-about *{ box-sizing:border-box; }
        .sifi-about h1,
        .sifi-about h2,
        .sifi-about h3{
          font-family:"Fraunces", serif;
          font-weight:600;
          letter-spacing:-0.01em;
          margin:0;
          color:var(--sa-ink);
        }
        .sifi-about p{ margin:0; }

        .sa-kicker{
          display:flex;
          align-items:center;
          gap:9px;
          font-size:0.82rem;
          letter-spacing:0.02em;
          color:var(--sa-gold);
          margin-bottom:18px;
          font-weight:500;
        }
        .sa-kicker-dot{ width:7px; height:7px; border-radius:50%; background:var(--sa-gold); flex:none; }

        .sa-link{
          display:inline-block;
          margin-top:28px;
          color:var(--sa-ink);
          text-decoration:none;
          font-weight:500;
          padding-bottom:3px;
          background-image:linear-gradient(var(--sa-gold),var(--sa-gold));
          background-position:0 100%;
          background-repeat:no-repeat;
          background-size:100% 1px;
          transition:background-size .35s ease;
        }
        .sa-link:hover{ background-size:0% 1px; }
        .sa-link:focus-visible{ outline:2px solid var(--sa-gold); outline-offset:4px; }

        .sa-frame{
          padding:14px;
          background:var(--sa-paper-deep);
          position:relative;
        }
        .sa-frame::after{
          content:"";
          position:absolute;
          width:26px; height:3px;
          background:var(--sa-gold);
          left:14px; bottom:-1px;
        }
        .sa-frame--sage{ background:var(--sa-sage-tint); }
        .sa-frame--clay{ background:var(--sa-clay-tint); }
        .sa-frame--hero img{ width:100%; height:auto; display:block; }
        .sa-photo{ width:100%; height:100%; display:block; object-fit:cover; aspect-ratio:5/4; }

        .sa-hero{
          max-width:1180px;
          margin:0 auto;
          padding:88px 32px 56px;
          display:grid;
          grid-template-columns:1.05fr 0.95fr;
          gap:56px;
          align-items:center;
        }
        .sa-hero-copy > *{ opacity:0; animation:saRise .8s cubic-bezier(.19,1,.22,1) forwards; }
        .sa-hero-copy > .sa-kicker{ animation-delay:.05s; }
        .sa-hero-copy > .sa-title-mask{ animation:none; opacity:1; overflow:hidden; }
        .sa-hero-copy > .sa-lead{ animation-delay:.5s; }
        .sa-hero-copy > .sa-link{ animation-delay:.7s; }

        .sa-hero-title{
          font-size:clamp(2.1rem, 4vw, 3.15rem);
          line-height:1.1;
          transform:translateY(105%);
          animation:saTitleUp .9s cubic-bezier(.16,.84,.24,1) forwards;
          animation-delay:.2s;
        }
        .sa-lead{
          margin-top:22px;
          max-width:52ch;
          font-size:1.05rem;
          line-height:1.75;
          color:rgba(23,35,28,0.82);
        }

        .sa-hero-visual{ max-width:440px; }
        .sa-hero-caption{
          display:flex;
          align-items:center;
          gap:12px;
          margin-top:16px;
          font-size:0.85rem;
          color:rgba(23,35,28,0.7);
        }
        .sa-hero-caption i{ width:1px; height:14px; background:rgba(23,35,28,0.25); display:block; font-style:normal; }

        .sa-reveal--pop{ opacity:0; transform:translateY(18px) scale(.98); transition:opacity .8s cubic-bezier(.19,1,.22,1) .25s, transform .8s cubic-bezier(.19,1,.22,1) .25s; }
        .sa-hero .sa-reveal--pop{ opacity:1; transform:none; }

        .sa-story{
          max-width:1180px;
          margin:0 auto;
          padding:0 32px 92px;
          display:grid;
          grid-template-columns:0.85fr 1.15fr;
          gap:60px;
          align-items:center;
        }
        .sa-story--reverse{ grid-template-columns:1.15fr 0.85fr; }
        .sa-story--reverse .sa-frame{ order:2; }
        .sa-story-copy h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); line-height:1.15; margin-bottom:20px; }
        .sa-story-copy p + p{ margin-top:16px; }
        .sa-story-copy p{ line-height:1.75; color:rgba(23,35,28,0.82); max-width:56ch; }

        .sa-reveal--left{ opacity:0; }
        .sa-reveal--left .sa-frame{ transform:translateX(-30px); opacity:0; transition:transform .9s cubic-bezier(.19,1,.22,1), opacity .9s ease; }
        .sa-reveal--left .sa-story-copy{ transform:translateY(16px); opacity:0; transition:transform .8s cubic-bezier(.19,1,.22,1) .15s, opacity .8s ease .15s; }
        .sa-reveal--left.is-in{ opacity:1; }
        .sa-reveal--left.is-in .sa-frame,
        .sa-reveal--left.is-in .sa-story-copy{ transform:none; opacity:1; }

        .sa-reveal--right{ opacity:0; }
        .sa-reveal--right .sa-frame{ transform:translateX(30px); opacity:0; transition:transform .9s cubic-bezier(.19,1,.22,1), opacity .9s ease; }
        .sa-reveal--right .sa-story-copy{ transform:translateY(16px); opacity:0; transition:transform .8s cubic-bezier(.19,1,.22,1) .15s, opacity .8s ease .15s; }
        .sa-reveal--right.is-in{ opacity:1; }
        .sa-reveal--right.is-in .sa-frame,
        .sa-reveal--right.is-in .sa-story-copy{ transform:none; opacity:1; }

        .sa-values-head{ max-width:1180px; margin:0 auto; padding:0 32px 40px; }
        .sa-values-head h2{ font-size:clamp(1.6rem,2.6vw,2.1rem); max-width:20ch; }
        .sa-reveal--fade{ opacity:0; transform:translateY(14px); transition:opacity .7s ease var(--sa-delay,0s), transform .7s cubic-bezier(.19,1,.22,1) var(--sa-delay,0s); }
        .sa-reveal--fade.is-in{ opacity:1; transform:none; }

        .sa-values{
          max-width:1180px;
          margin:0 auto;
          padding:0 32px;
          display:grid;
          grid-template-columns:1fr 1fr;
          border-top:1px solid rgba(23,35,28,0.12);
          border-left:1px solid rgba(23,35,28,0.12);
        }
        .sa-value{ padding:38px 34px; border-right:1px solid rgba(23,35,28,0.12); border-bottom:1px solid rgba(23,35,28,0.12); transition:background .3s ease, transform .3s ease; }
        .sa-value:nth-child(odd){ background:var(--sa-paper-deep); }
        .sa-value:hover{ background:var(--sa-sage-tint); transform:translateY(-4px); }
        .sa-value-icon{ display:inline-flex; width:32px; height:32px; color:var(--sa-gold); margin-bottom:16px; }
        .sa-value-icon svg{ width:100%; height:100%; }
        .sa-value h3{ font-size:1.12rem; margin-bottom:10px; }
        .sa-value p{ line-height:1.7; color:rgba(23,35,28,0.8); font-size:0.95rem; }

        @keyframes saRise{ from{ opacity:0; transform:translateY(16px);} to{ opacity:1; transform:translateY(0);} }
        @keyframes saTitleUp{ from{ transform:translateY(105%);} to{ transform:translateY(0);} }

        @media (max-width: 860px){
          .sa-hero{ grid-template-columns:1fr; padding:56px 20px 36px; gap:32px; }
          .sa-hero-visual{ order:-1; max-width:100%; }
          .sa-story{ grid-template-columns:1fr !important; padding:0 20px 56px; gap:26px; }
          .sa-story--reverse .sa-frame{ order:0; }
          .sa-values{ grid-template-columns:1fr; }
          .sa-values-head{ padding:0 20px 28px; }
        }

        @media (prefers-reduced-motion: reduce){
          .sifi-about *{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; }
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
