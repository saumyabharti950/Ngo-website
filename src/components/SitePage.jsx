import { useEffect, useRef } from "react";

const pages = {
  "/about-us": {
    label: "ABOUT SIFI FOUNDATION", title: "Building Pathways to Inclusive and Sustainable Development",
    text: "Social Initiative for India Foundation (SIFI Foundation) is a Section 8 not-for-profit organisation committed to advancing inclusive, sustainable and community-led development.\n\nThe Foundation brings together field-level implementation, professional programme management, research, partnerships and community participation to address development challenges and create lasting opportunities for underserved and vulnerable communities.\n\nOur work spans healthcare and public health, education and digital learning, skill development, livelihoods, women and youth empowerment, agriculture, environmental sustainability, water and sanitation, community development, research and social impact assessment.\n\nWe believe that sustainable development begins with understanding communities, listening to their needs and working with them to create practical and measurable solutions.",
    cards: [["Our vision", "An inclusive and sustainable India where every person can live with dignity, knowledge, health, livelihood security and equal opportunity."], ["Our mission", "To improve quality of life through participatory programmes in healthcare, education, skills, livelihoods, technology and essential services."], ["Our values", "Dignity, inclusion, integrity, participation, sustainability, accountability and innovation guide our work."], ["How we work", "We listen to communities, understand local priorities, build partnerships and use evidence to design programmes that can create lasting value."]],
  },
  "/work": {
    label: "OUR WORK", title: "Development programmes that create opportunity",
    text: "Our integrated programmes respond to local needs and connect health, learning, skills, livelihoods and climate-resilient development.",
    cards: [["Education & Digital Learning", "Learning support, literacy, study materials, libraries and digital access that help children and young people learn with confidence."], ["Women & Girl Empowerment", "Education, health awareness, leadership, financial literacy, skills and livelihood opportunities for women and girls."], ["Youth Skills & Employment", "Vocational and technical training, career guidance, digital skills and employment pathways for the youth."], ["Healthcare & Public Health", "Preventive healthcare, nutrition, sanitation, awareness and community outreach that strengthen wellbeing."], ["Livelihoods & Enterprise", "Support for self-employment, micro-enterprise, financial literacy, entrepreneurship and sustainable income generation."], ["Environment & Sustainable Development", "Water conservation, clean energy, sustainable farming, biodiversity and climate-responsive community action."]],
  },
  "/impact-stories": {
    label: "IMPACT STORIES", title: "Change that starts with people",
    text: "Every programme begins with listening. We document the journeys, participation and outcomes that show how community-led action creates meaningful change.",
    cards: [["From learning to confidence", "When children receive consistent learning support and access to digital resources, they gain stronger foundations for the future."], ["Women leading change", "Skills, awareness and livelihood opportunities help women make informed decisions, strengthen families and participate in community leadership."], ["Youth finding opportunity", "Upskilling, mentoring and career pathways help young people connect their abilities with dignified work and enterprise."], ["Measuring what matters", "We look beyond activity counts to understand access, inclusion, outcomes, sustainability and learning."]],
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

function GalleryPage() {
  const images = ["healthcare.jpg", "education.jpg", "food.jpg", "volunteer.jpg", "elderly.jpg", "hero.jpg"];
  return <section className="site-page"><div className="container"><div className="page-intro"><span>GALLERY</span><h1>Moments of community action</h1><p>A glimpse of the people, partnerships and purpose behind our work.</p></div><div className="gallery-grid">{images.map((image) => <img key={image} src={`/images/${image}`} alt="SIFI Foundation community work" />)}</div></div></section>;
}

const newPages = {
  "/take-action": { eyebrow: "TAKE ACTION", title: "Small actions can open big possibilities.", text: "Choose a meaningful way to stand alongside communities and turn care into practical, lasting change.", image: "Takeaction.png", cards: [["Give", "Support learning, health, skills and livelihoods through a contribution."], ["Volunteer", "Offer your time, expertise or voice where it can make a difference."], ["Partner", "Build a responsible programme with our community and institutional teams."]] },
  "/get-involved": { eyebrow: "GET INVOLVED", title: "Bring your purpose to the movement.", text: "Whether you are an individual, a team or an institution, there is a thoughtful place to begin.", image: "Getinvolbed.png", cards: [["Individuals", "Share skills, mentor young people or amplify community stories."], ["Organisations", "Design high-value CSR and development partnerships with us."], ["Communities", "Help identify priorities and shape local solutions together."]] },
  "/blog": { eyebrow: "FIELD NOTES", title: "Ideas from the ground, made for change.", text: "Stories, learning and reflections from people working to make opportunity more inclusive.", image: "Blog.png", cards: [["Learning with dignity", "Why access to consistent, joyful learning changes more than classrooms."], ["The power of local voices", "Community insight is not an input—it is the starting point."], ["Measuring meaningful progress", "Looking beyond numbers to understand durable outcomes."]] },
  "/contact": { eyebrow: "CONTACT SIFI", title: "Let’s make good work possible together.", text: "Reach out to start a conversation about partnerships, volunteering, programmes or community priorities.", image: "Contact.png", cards: [["Write to us", "info@sififoundation.org"], ["Call our team", "0651-3591618"], ["Visit us", "C/22, Patel Park, Harmu Housing Colony, Ranchi, Jharkhand."]] },
};

function NewPage({ page }) {
  return <section className="feature-page"><div className="feature-page-orb orb-one" /><div className="feature-page-orb orb-two" /><div className="container feature-page-grid"><div className="feature-page-copy"><span>{page.eyebrow}</span><h1>{page.title}</h1><p>{page.text}</p><a className="btn btn-primary" href={page.eyebrow === "CONTACT SIFI" ? "mailto:info@sififoundation.org" : "/donate"}>{page.eyebrow === "CONTACT SIFI" ? "Email our team" : "Start today"}</a></div><div className="feature-page-image"><img src={`/images/${page.image}`} alt="SIFI Foundation community work" /><div>Community-led<br/><strong>change</strong></div></div></div><div className="container feature-page-cards">{page.cards.map(([title, text], index) => <article key={title}><b>0{index + 1}</b><h2>{title}</h2><p>{text}</p></article>)}</div></section>;
}

/* ---------- icons used only inside the "what guides us" panel ---------- */
const VALUE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i0"><path d="M4 17h16M6.5 17a5.5 5.5 0 0 1 11 0" strokeLinecap="round" /><path d="M12 4v3M6 7l1.8 1.8M18 7l-1.8 1.8" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i1"><circle cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path d="M12 2.8v2.4M21.2 12h-2.4" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i2"><path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15Z" strokeLinejoin="round" /><path d="M6 18C9 13 12 10 17 7" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" key="i3"><circle cx="9" cy="12" r="5.4" /><circle cx="15" cy="12" r="5.4" /></svg>,
];

function AboutPage({ page }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("sifi-about-fonts")) return;
    const link = document.createElement("link");
    link.id = "sifi-about-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

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
  const focusAreas = (pages["/work"]?.cards || []).map(([title]) => title);

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
          <a className="sa-link" href="/work">
            <span>See our programmes</span>
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

      {/* ---------------- programme areas, in motion ---------------- */}
      {focusAreas.length > 0 && (
        <div className="sa-marquee">
          <ul className="sa-marquee-track">
            {focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <ul className="sa-marquee-track" aria-hidden="true">
            {focusAreas.map((area) => (
              <li key={`${area}-dup`}>{area}</li>
            ))}
          </ul>
        </div>
      )}

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
          --sa-ink:#1F2A22;
          --sa-paper:#FAF6EE;
          --sa-paper-deep:#EFE7D8;
          --sa-sage-tint:#E7ECE3;
          --sa-clay-tint:#F1E1D8;
          --sa-gold:#BD7F1E;
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
          font-size:0.8rem;
          letter-spacing:0.03em;
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

        /* ---------- image frames (used everywhere so images are never cropped oddly) ---------- */
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

        /* ---------- hero ---------- */
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
          color:rgba(31,42,34,0.82);
        }

        .sa-hero-visual{ max-width:440px; }
        .sa-hero-caption{
          display:flex;
          align-items:center;
          gap:12px;
          margin-top:16px;
          font-size:0.85rem;
          color:rgba(31,42,34,0.7);
        }
        .sa-hero-caption i{ width:1px; height:14px; background:var(--sa-line, rgba(31,42,34,0.25)); display:block; font-style:normal; }

        .sa-reveal--pop{ opacity:0; transform:translateY(18px) scale(.98); transition:opacity .8s cubic-bezier(.19,1,.22,1) .25s, transform .8s cubic-bezier(.19,1,.22,1) .25s; }
        .sa-reveal--pop.is-in,
        .sa-hero .sa-reveal--pop{ opacity:1; transform:none; } /* hero visual reveals on load, not on scroll */

        /* ---------- marquee ---------- */
        .sa-marquee{ background:var(--sa-ink); overflow:hidden; padding:20px 0; margin-bottom:100px; }
        .sa-marquee-track{ display:flex; gap:14px; list-style:none; margin:0; padding:0 14px; width:max-content; animation:saMarquee 34s linear infinite; }
        .sa-marquee:hover .sa-marquee-track{ animation-play-state:paused; }
        .sa-marquee-track li{ background:var(--sa-sage-tint); color:var(--sa-ink); font-size:0.85rem; white-space:nowrap; padding:8px 16px; }

        /* ---------- story sections ---------- */
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
        .sa-story-copy p{ line-height:1.75; color:rgba(31,42,34,0.82); max-width:56ch; }

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

        /* ---------- values ---------- */
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
          border-top:1px solid rgba(31,42,34,0.12);
          border-left:1px solid rgba(31,42,34,0.12);
        }
        .sa-value{ padding:38px 34px; border-right:1px solid rgba(31,42,34,0.12); border-bottom:1px solid rgba(31,42,34,0.12); }
        .sa-value:nth-child(odd){ background:var(--sa-paper-deep); }
        .sa-value-icon{ display:inline-flex; width:32px; height:32px; color:var(--sa-gold); margin-bottom:16px; }
        .sa-value-icon svg{ width:100%; height:100%; }
        .sa-value h3{ font-size:1.12rem; margin-bottom:10px; }
        .sa-value p{ line-height:1.7; color:rgba(31,42,34,0.8); font-size:0.95rem; }

        /* ---------- keyframes ---------- */
        @keyframes saRise{ from{ opacity:0; transform:translateY(16px);} to{ opacity:1; transform:translateY(0);} }
        @keyframes saTitleUp{ from{ transform:translateY(105%);} to{ transform:translateY(0);} }
        @keyframes saMarquee{ from{ transform:translateX(0);} to{ transform:translateX(-100%);} }

        /* ---------- responsive ---------- */
        @media (max-width: 860px){
          .sa-hero{ grid-template-columns:1fr; padding:56px 20px 36px; gap:32px; }
          .sa-hero-visual{ order:-1; max-width:100%; }
          .sa-story{ grid-template-columns:1fr !important; padding:0 20px 56px; gap:26px; }
          .sa-story--reverse .sa-frame{ order:0; }
          .sa-values{ grid-template-columns:1fr; }
          .sa-values-head{ padding:0 20px 28px; }
        }

        /* ---------- accessibility ---------- */
        @media (prefers-reduced-motion: reduce){
          .sifi-about *{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; }
        }
      `}</style>
    </section>
  );
}

function SitePage({ path }) {
  if (newPages[path]) return <NewPage page={newPages[path]} />;
  if (path === "/gallery") return <GalleryPage />;
  const page = pages[path] || pages["/about-us"];
  if (path === "/about-us") return <AboutPage page={page} />;
  return <section className="site-page"><div className="container"><div className="page-intro"><span>{page.label}</span><h1>{page.title}</h1><p>{page.text}</p></div><div className="page-card-grid">{page.cards.map(([title, text]) => <article key={title}><h2>{title}</h2><p>{text}</p></article>)}</div></div></section>;
}

export default SitePage;