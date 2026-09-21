import { useEffect, useRef } from "react";
import { ArrowRight, BadgeCheck, BookOpenCheck, ChevronDown, FileCheck2, HandHeart, HeartPulse, ShieldCheck, Sparkles, Target, UsersRound } from "lucide-react";
import { PublishedContentSection } from "./PublishedContent";
import Causes from "./Causes";

const impact = [
  [UsersRound, "Choose a cause", "Pick education, health, food support or community development."],
  [HandHeart, "Donate securely", "Your support is routed to active programmes with clear records."],
  [BadgeCheck, "Receive NGO receipt", "We share confirmations, updates and transparent documentation."],
];

const journey = [
  ["The Humble Beginning", "Started with listening sessions, field visits and community conversations."],
  ["Formal Registration", "Registered as a Section 8 not-for-profit with compliance-led governance."],
  ["Elevate & Feed Relief", "Built programmes around health, learning, livelihoods and food security."],
];

const leaders = ["Neeraj Kumar", "Sharvan Kumar", "Rajan Kumar", "Kishan Bhukla", "Sandeep Kumar", "Sourya"];
const volunteers = ["Vikash Kumar", "Raja Kumar", "Sita", "Akash Jain", "Muskan"];

const faqs = [
  ["Are donations tax exempt?", "Donation receipts and applicable exemption details are shared according to the Foundation's current compliance status."],
  ["How do I become a volunteer?", "Use the volunteer form or contact the team with your location, skills and available time."],
  ["Where is my donation used?", "Donations support eligible charitable and community-development activities across active programmes."],
  ["Can I support a specific campaign?", "Yes. You can choose a campaign category such as education, health, food, women empowerment or emergency relief while contributing."],
  ["Do you share updates after donation?", "We share confirmations and programme updates wherever possible so supporters can understand how their contribution is helping."],
  ["Can companies partner for CSR work?", "Yes. We welcome responsible partnerships for programme design, implementation, documentation and measurable community impact."],
  ["Is volunteering available for students?", "Students can support awareness drives, learning activities, research assistance, communication and local outreach with guidance from the team."],
  ["How do you maintain transparency?", "We maintain records, documentation, receipts and reporting practices so donors, partners and communities can trust the work."],
];

function useReveal(rootRef) {
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll(".home-reveal");
    if (!nodes?.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef]);
}

function useCinematicCursor(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const moveCursor = (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
      root.classList.add("cursor-live");
    };
    const leaveCursor = () => root.classList.remove("cursor-live");
    root.addEventListener("pointermove", moveCursor);
    root.addEventListener("pointerleave", leaveCursor);
    return () => {
      root.removeEventListener("pointermove", moveCursor);
      root.removeEventListener("pointerleave", leaveCursor);
    };
  }, [rootRef]);
}

function Heading({ label, title, text }) {
  return (
    <div className="home-heading">
      <span>{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function AvatarCard({ name, index, type = "leader" }) {
  return (
    <article className={`avatar-card ${type}`} style={{ "--d": `${index * 70}ms` }}>
      <div className="avatar-photo">
        <img src={index % 2 ? "/images/About.png" : "/images/volunteer.jpg"} alt={name} />
        <span><BadgeCheck size={13} /></span>
      </div>
      <h3>{name}</h3>
      <p>{type === "leader" ? "Core Team" : "Verified Volunteer"}</p>
    </article>
  );
}

export default function ContentSections() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  useCinematicCursor(rootRef);

  return (
    <div className="home-sections" ref={rootRef}>
      <section className="impact-section-lite">
        <div className="home-shell">
          <Heading label="HOW IT WORKS" title="How Your Support Creates Impact" text="Every contribution moves through a simple, transparent and community-first path." />
          <div className="impact-grid">
            {impact.map(([Icon, title, text], index) => (
              <article className={`impact-card home-reveal ${index === 1 ? "reveal-up" : index === 2 ? "reveal-right" : "reveal-left"}`} style={{ "--d": `${index * 140}ms` }} key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="legacy-section">
        <div className="home-shell">
          <Heading label="ABOUT US" title="A legacy of trust, compassion, and relentless efforts to lift humanity." />
          <div className="legacy-grid">
            <div className="legacy-stack">
              <article className="home-reveal reveal-left"><Target /><h3>Our Mission</h3><p>Improve quality of life through inclusive, participatory and evidence-based access to healthcare, education, livelihoods, skills and essential services.</p></article>
              <article className="home-reveal reveal-up" style={{ "--d": "180ms" }}><HeartPulse /><h3>Our Vision</h3><p>An inclusive India where communities live with health, dignity, knowledge, livelihood security and equal opportunity.</p></article>
            </div>
            <article className="foundation-card home-reveal reveal-right" style={{ "--d": "240ms" }}>
              <span>About our Foundation</span>
              <h3>SIFI Foundation</h3>
              <p>Social Initiative for India Foundation works with communities and institutions to create sustainable development solutions.</p>
              <div><a href="/about-us">Know more about us</a><a href="/work">Our action areas</a></div>
            </article>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="home-shell">
          <Heading label="OUR JOURNEY" title="Our Journey: From 2025 to 2026 & Beyond" text="Small steps, field learning and community partnerships continue to shape the road ahead." />
          <div className="journey-line">
            {journey.map(([title, text], index) => (
              <article className={`journey-card home-reveal ${index % 2 ? "right reveal-right" : "left reveal-left"}`} style={{ "--d": `${index * 180}ms` }} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Causes />

      <section id="leadership" className="people-section">
        <div className="home-shell">
          <Heading label="OUR TRUSTED TEAM" title="Meet Our Core Leadership & Team" text="A committed group working across planning, field action, partnerships and governance." />
          <div className="avatar-row">
            {leaders.map((name, index) => <AvatarCard key={name} name={name} index={index} />)}
          </div>
        </div>
      </section>

      <section id="get-involved" className="volunteer-section">
        <div className="home-shell volunteer-grid">
          <div className="volunteer-image home-reveal reveal-left"><img src="/images/Getinvolbed.png" alt="Volunteer support" /></div>
          <div className="volunteer-panel home-reveal reveal-right" style={{ "--d": "180ms" }}>
            <span><HandHeart size={14} /> LEND YOUR HANDS</span>
            <h2>Be the hands that build hope. Give your time, change a life.</h2>
            <p>Volunteer, mentor, partner or contribute expertise to create direct community impact.</p>
            <div className="volunteer-actions">
              <a href="/volunteer">Register as volunteer</a>
              <a href="/donate">Support programmes</a>
            </div>
          </div>
        </div>
      </section>

      <section className="people-section volunteers">
        <div className="home-shell">
          <Heading label="OUR VOLUNTEERS" title="Meet Our Verified Volunteers" text="These dedicated members help turn plans into field action." />
          <div className="avatar-row volunteer-avatars">
            {volunteers.map((name, index) => <AvatarCard key={name} name={name} index={index} type="volunteer" />)}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section-lite">
        <div className="home-shell">
          <Heading label="OUR IMPACT GALLERY" title="Visual highlights from our charity drives and ground activities." />
          <PublishedContentSection module="gallery" title="Gallery" />
        </div>
      </section>

      <section id="transparency" className="accountability-section">
        <div className="home-shell">
          <Heading label="TRANSPARENT ACCOUNTABILITY" title="We hold ourselves to the highest standards of financial ethical accountability." />
          <div className="account-grid">
            {[[ShieldCheck, "NGO Certificate"], [FileCheck2, "Annual & Audit Reports"], [BookOpenCheck, "Legal Reports"]].map(([Icon, title], index) => (
              <article className={`account-card home-reveal ${index === 0 ? "reveal-left" : index === 1 ? "reveal-up" : "reveal-right"}`} style={{ "--d": `${index * 150}ms` }} key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>Documentation, reporting and governance processes help supporters trust every step.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section-lite">
        <div className="home-shell">
          <Heading label="QUESTIONS ANSWERED" title="Frequently Asked Questions" text="Clear answers for donors, volunteers, partners and supporters before they take action." />
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <details className="home-reveal reveal-up" style={{ "--d": `${index * 70}ms` }} key={question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<ChevronDown size={17} /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="yellow-cta">
        <div className="home-shell cta-card">
          <div>
            <span><Sparkles size={14} /> JOIN THE MOVEMENT</span>
            <h2>Together, we can make a difference.</h2>
            <p>Small acts of support become real change when they reach the right people at the right time.</p>
            <a href="/donate">Explore causes <ArrowRight size={15} /></a>
          </div>
          <img src="/images/Takeaction.png" alt="Community children smiling" />
        </div>
      </section>

      <style>{`
        .home-sections{ --navy:#111b3a; --pink:#ff1576; --yellow:#ffc20f; --green:#05b36b; --soft:#eef8ff; --cream:#fff3cf; --line:#e7ebf2; --cursor-x:50%; --cursor-y:50%; position:relative; font-family:Inter,system-ui,sans-serif; color:var(--navy); background:#0f1d3b; overflow:hidden; }
        .home-sections *{ box-sizing:border-box; }
        .home-sections::before{ content:""; position:fixed; z-index:30; left:var(--cursor-x); top:var(--cursor-y); width:220px; height:220px; border-radius:50%; pointer-events:none; opacity:0; transform:translate(-50%,-50%) scale(.65); background:radial-gradient(circle, rgba(255,194,15,.22), rgba(255,21,118,.13) 36%, transparent 68%); mix-blend-mode:multiply; transition:opacity .22s ease, transform .22s ease; }
        .home-sections.cursor-live::before{ opacity:1; transform:translate(-50%,-50%) scale(1); }
        .home-shell{ width:min(1060px, calc(100% - 34px)); margin:0 auto; }
        .home-heading{ max-width:620px; margin:0 auto 34px; text-align:center; }
        .home-heading span,.yellow-cta span{ display:inline-flex; align-items:center; gap:6px; color:var(--green); font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
        .home-heading h2{ margin:8px auto 10px; color:var(--navy); font-size:clamp(28px,3.4vw,42px); line-height:1.04; font-weight:900; letter-spacing:0; }
        .home-heading p{ margin:0; color:#667085; font-size:13px; line-height:1.7; }
        .home-reveal{ opacity:0; transform:translateY(42px) scale(.985); filter:blur(8px); transition:opacity .9s cubic-bezier(.19,1,.22,1) var(--d,0s), transform .9s cubic-bezier(.19,1,.22,1) var(--d,0s), filter .9s ease var(--d,0s); }
        .home-reveal.reveal-left{ transform:translateX(-64px) scale(.985); }
        .home-reveal.reveal-right{ transform:translateX(64px) scale(.985); }
        .home-reveal.reveal-down{ transform:translateY(-54px) scale(.985); }
        .home-reveal.reveal-up{ transform:translateY(54px) scale(.985); }
        .home-reveal.is-visible{ opacity:1; transform:none; filter:none; }
        .impact-section-lite,.legacy-section,.journey-section,.people-section,.volunteer-section,.gallery-section-lite,.accountability-section,.faq-section-lite,.yellow-cta{ position:relative; padding:82px 0; }
        .impact-section-lite::before,.legacy-section::before,.journey-section::before,.people-section::before,.gallery-section-lite::before,.accountability-section::before,.faq-section-lite::before{ content:""; position:absolute; inset:0; pointer-events:none; opacity:.48; background-image:url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2305b36b' stroke-opacity='.12' stroke-width='2'%3E%3Cpath d='M20 26h26v26H20zM110 98h28v28h-28z'/%3E%3Ccircle cx='116' cy='34' r='13'/%3E%3Cpath d='M50 123c22-26 44-26 66 0'/%3E%3C/g%3E%3C/svg%3E"); background-size:160px 160px; }
        .home-shell{ position:relative; z-index:1; }
        .impact-section-lite{ background:linear-gradient(135deg,#eafff4 0%,#f3f8ff 45%,#fff3ca 100%); }
        .legacy-section{ background:linear-gradient(145deg,#111b3a 0%,#17375c 58%,#0e6040 100%); }
        .journey-section{ background:linear-gradient(180deg,#f3f8ff 0%,#fff7dc 100%); }
        .people-section{ background:linear-gradient(135deg,#ffffff 0%,#eaf7ff 100%); }
        .people-section.volunteers{ background:linear-gradient(145deg,#0f1d3b 0%,#143f64 100%); }
        .volunteer-section{ background:linear-gradient(135deg,#fff2bd 0%,#e8fff5 55%,#f3f8ff 100%); }
        .gallery-section-lite{ background:linear-gradient(180deg,#f1f6ff 0%,#ffffff 100%); }
        .accountability-section{ background:linear-gradient(135deg,#fff7d9 0%,#effff6 100%); }
        .faq-section-lite{ overflow:hidden; background:radial-gradient(760px circle at 20% 10%, rgba(255,194,15,.22), transparent 55%), radial-gradient(720px circle at 88% 35%, rgba(5,179,107,.22), transparent 58%), linear-gradient(145deg,#101c3a 0%,#16375d 55%,#092238 100%); }
        .faq-section-lite::after{ content:""; position:absolute; inset:-20%; pointer-events:none; opacity:.22; background:url("data:image/svg+xml,%3Csvg width='210' height='160' viewBox='0 0 210 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.36' stroke-width='2'%3E%3Cpath d='M18 35h35v35H18zM145 28h36v36h-36zM42 128c26-42 58-42 84 0s44 42 62 0'/%3E%3Ccircle cx='155' cy='112' r='18'/%3E%3C/g%3E%3C/svg%3E"); animation:faqDrift 24s linear infinite; }
        .faq-section-lite .home-heading h2{ color:#fff; }
        .faq-section-lite .home-heading p{ color:rgba(255,255,255,.72); }
        .faq-section-lite .home-heading span{ color:#ffc20f; }
        .legacy-section .home-heading h2,.people-section.volunteers .home-heading h2{ color:#fff; }
        .legacy-section .home-heading p,.people-section.volunteers .home-heading p{ color:rgba(255,255,255,.7); }
        .legacy-section .home-heading span,.people-section.volunteers .home-heading span{ color:#ffc20f; }
        .impact-grid,.account-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .impact-card,.account-card,.legacy-stack article,.foundation-card{ position:relative; overflow:hidden; border:1px solid var(--line); border-radius:8px; background:#fff; padding:24px; box-shadow:0 14px 30px rgba(16,28,58,.05); transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease; }
        .impact-card::before,.account-card::before,.legacy-stack article::before,.foundation-card::before{ content:""; position:absolute; inset:auto -30px -54px auto; width:128px; height:128px; border-radius:36px; opacity:.14; background:var(--yellow); transform:rotate(22deg); transition:transform .35s ease, opacity .35s ease; }
        .impact-card::after,.account-card::after,.legacy-stack article::after,.foundation-card::after{ content:""; position:absolute; right:13px; bottom:13px; width:82px; height:58px; opacity:.15; background:url("data:image/svg+xml,%3Csvg width='96' height='68' viewBox='0 0 96 68' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ff1576' stroke-width='5' stroke-linecap='round'%3E%3Cpath d='M6 54c15-32 29-32 44 0s29 32 44 0'/%3E%3Cpath d='M13 18h22M61 18h22'/%3E%3C/g%3E%3C/svg%3E") center/contain no-repeat; }
        .impact-card:hover,.account-card:hover,.legacy-stack article:hover,.foundation-card:hover{ transform:translateY(-5px); border-color:#dce8df; box-shadow:0 22px 44px rgba(16,28,58,.12); }
        .impact-card:hover::before,.account-card:hover::before,.legacy-stack article:hover::before,.foundation-card:hover::before{ opacity:.24; transform:rotate(14deg) translate(-8px,-8px); }
        .impact-card > *, .account-card > *, .legacy-stack article > *, .foundation-card > *{ position:relative; z-index:1; }
        .impact-card svg,.legacy-stack svg,.account-card svg{ color:var(--green); margin-bottom:13px; }
        .impact-card h3,.account-card h3,.legacy-stack h3,.foundation-card h3,.journey-card h3,.avatar-card h3{ margin:0 0 8px; color:var(--navy); font-size:16px; line-height:1.25; font-weight:900; letter-spacing:0; }
        .impact-card p,.account-card p,.legacy-stack p,.foundation-card p,.journey-card p{ margin:0; color:#667085; font-size:12px; line-height:1.65; }
        .legacy-grid{ display:grid; grid-template-columns:.9fr 1.1fr; gap:22px; align-items:stretch; }
        .legacy-stack{ display:grid; gap:16px; }
        .foundation-card{ display:flex; flex-direction:column; justify-content:center; background:#fffdf6; min-height:260px; }
        .foundation-card > span{ color:#f29d05; font-size:11px; font-weight:900; text-transform:uppercase; }
        .foundation-card div{ display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
        .foundation-card a{ padding:9px 12px; border-radius:999px; background:#e9fff5; color:var(--green); font-size:10px; font-weight:900; text-decoration:none; }
        .journey-line{ position:relative; max-width:790px; margin:0 auto; padding:4px 0; }
        .journey-line::before{ content:""; position:absolute; top:0; bottom:0; left:50%; width:3px; border-radius:999px; background:linear-gradient(var(--yellow), var(--green)); transform:translateX(-50%); }
        .journey-card{ position:relative; width:calc(50% - 32px); margin:0 0 28px; padding:22px; border:1px solid var(--line); border-radius:8px; background:#fff; box-shadow:0 16px 34px rgba(16,28,58,.08); transition:transform .28s ease, box-shadow .28s ease; }
        .journey-card:hover{ transform:translateY(-5px); box-shadow:0 24px 44px rgba(16,28,58,.14); }
        .journey-card.left{ margin-right:auto; }
        .journey-card.right{ margin-left:auto; }
        .journey-card::after{ content:""; position:absolute; top:26px; width:14px; height:14px; border-radius:50%; background:var(--green); box-shadow:0 0 0 5px #e9fff5; }
        .journey-card.left::after{ right:-40px; }
        .journey-card.right::after{ left:-40px; background:var(--yellow); box-shadow:0 0 0 5px #fff4c8; }
        .journey-card span{ color:var(--green); font-size:11px; font-weight:900; }
        .people-section{ overflow:hidden; }
        .avatar-row{ display:flex; gap:15px; overflow:auto; padding:6px 2px 18px; scroll-snap-type:x mandatory; }
        .avatar-card{ position:relative; flex:0 0 168px; scroll-snap-align:start; border-radius:8px; overflow:hidden; background:#10233e; color:#fff; box-shadow:0 16px 34px rgba(16,28,58,.16); opacity:0; transform:translateY(18px); animation:avatarIn .64s cubic-bezier(.19,1,.22,1) var(--d,0s) forwards; transition:transform .28s ease, box-shadow .28s ease; }
        .avatar-card::after{ content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(140deg, transparent 55%, rgba(255,194,15,.22)); opacity:0; transition:opacity .25s ease; }
        .avatar-card:hover{ transform:translateY(-5px); box-shadow:0 24px 44px rgba(16,28,58,.24); }
        .avatar-card:hover::after{ opacity:1; }
        .avatar-photo{ position:relative; height:190px; background:#20324f; }
        .avatar-photo img{ width:100%; height:100%; object-fit:cover; display:block; opacity:.78; }
        .avatar-photo span{ position:absolute; top:8px; right:8px; display:grid; place-items:center; width:23px; height:23px; border-radius:50%; background:var(--green); color:#fff; }
        .avatar-card h3{ color:#fff; font-size:14px; padding:11px 12px 0; }
        .avatar-card p{ margin:2px 12px 13px; color:#ffc20f; font-size:10px; font-weight:900; }
        .volunteer-grid{ display:grid; grid-template-columns:.85fr 1.15fr; gap:24px; align-items:center; }
        .volunteer-image{ border-radius:8px; overflow:hidden; box-shadow:0 18px 40px rgba(16,28,58,.18); }
        .volunteer-image img{ display:block; width:100%; height:330px; object-fit:cover; }
        .volunteer-panel{ border:1px solid var(--line); border-radius:8px; padding:34px; background:#fff; box-shadow:0 16px 34px rgba(16,28,58,.08); }
        .volunteer-panel span{ display:inline-flex; align-items:center; gap:7px; color:var(--green); font-size:11px; font-weight:900; }
        .volunteer-panel h2{ margin:10px 0; color:var(--navy); font-size:clamp(26px,3vw,38px); line-height:1.07; font-weight:900; letter-spacing:0; }
        .volunteer-panel p{ color:#667085; line-height:1.7; margin:0 0 20px; }
        .volunteer-actions{ display:flex; gap:10px; flex-wrap:wrap; }
        .volunteer-actions a,.yellow-cta a{ display:inline-flex; align-items:center; gap:7px; min-height:38px; padding:0 15px; border-radius:999px; background:var(--green); color:#fff; font-size:11px; font-weight:900; text-decoration:none; }
        .volunteer-actions a:nth-child(2){ background:#edf0f5; color:var(--navy); }
        .gallery-section-lite .cms-section{ padding:0; background:transparent; }
        .gallery-section-lite .cms-section > .container{ width:100%; padding:0; }
        .gallery-section-lite .section-heading{ display:none; }
        .gallery-section-lite .table-action{ display:flex; width:max-content; margin:24px auto 0; padding:10px 15px; border-radius:999px; background:#2563eb; color:#fff; font-size:11px; font-weight:900; text-decoration:none; }
        .faq-list{ max-width:870px; margin:0 auto; display:grid; gap:13px; perspective:1200px; }
        .faq-list details{ position:relative; border:1px solid rgba(255,255,255,.14); border-radius:10px; background:linear-gradient(135deg, rgba(255,255,255,.96), rgba(235,246,255,.9)); overflow:hidden; box-shadow:0 18px 42px rgba(0,0,0,.18); transition:transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .faq-list details::before{ content:""; position:absolute; inset:0 auto 0 0; width:5px; background:linear-gradient(#ffc20f,#05b36b,#ff1576); }
        .faq-list details::after{ content:""; position:absolute; right:-45px; bottom:-60px; width:150px; height:150px; border-radius:38px; background:#ffc20f; opacity:.12; transform:rotate(24deg); transition:transform .35s ease, opacity .35s ease; }
        .faq-list details:hover{ transform:translateY(-4px) rotateX(1deg); border-color:rgba(255,194,15,.34); box-shadow:0 26px 58px rgba(0,0,0,.24); }
        .faq-list details[open]{ background:linear-gradient(135deg,#fff 0%,#fff7d8 100%); }
        .faq-list details[open]::after{ opacity:.22; transform:rotate(14deg) translate(-8px,-8px); }
        .faq-list summary{ position:relative; z-index:1; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:14px; padding:18px 22px; cursor:pointer; color:var(--navy); font-size:14px; font-weight:900; list-style:none; }
        .faq-list summary span{ display:grid; place-items:center; width:32px; height:32px; border-radius:50%; background:#111b3a; color:#ffc20f; font-size:11px; box-shadow:0 8px 18px rgba(17,27,58,.18); }
        .faq-list summary::-webkit-details-marker{ display:none; }
        .faq-list summary svg{ color:#05b36b; transition:transform .28s ease; }
        .faq-list details[open] summary svg{ transform:rotate(180deg); }
        .faq-list p{ position:relative; z-index:1; margin:0; padding:0 22px 20px 68px; color:#566176; font-size:13px; line-height:1.75; animation:faqAnswer .32s ease both; }
        @keyframes faqAnswer{ from{ opacity:0; transform:translateY(-8px); } to{ opacity:1; transform:none; } }
        @keyframes faqDrift{ to{ transform:translate3d(-90px,80px,0); } }
        .yellow-cta{ background:linear-gradient(180deg,#ffffff 0%,#fff4c8 100%); }
        .cta-card{ display:grid; grid-template-columns:.95fr 1.05fr; align-items:stretch; overflow:hidden; border-radius:12px; background:var(--yellow); box-shadow:0 18px 44px rgba(16,28,58,.16); }
        .cta-card > div{ padding:42px; display:flex; flex-direction:column; justify-content:center; }
        .yellow-cta span{ color:#775400; }
        .yellow-cta h2{ margin:10px 0; color:#111b3a; font-size:clamp(34px,4.2vw,56px); line-height:.94; font-weight:900; letter-spacing:0; text-transform:uppercase; }
        .yellow-cta p{ margin:0 0 22px; color:#4d421f; line-height:1.65; }
        .yellow-cta a{ background:#111b3a; width:max-content; }
        .cta-card img{ width:100%; height:100%; min-height:330px; object-fit:cover; display:block; }
        @keyframes avatarIn{ to{ opacity:1; transform:none; } }
        @media (max-width: 860px){ .impact-grid,.account-grid,.legacy-grid,.volunteer-grid,.cta-card{ grid-template-columns:1fr; }.journey-line::before{ left:8px; }.journey-card,.journey-card.left,.journey-card.right{ width:calc(100% - 34px); margin-left:34px; }.journey-card.left::after,.journey-card.right::after{ left:-33px; right:auto; } }
        @media (max-width: 560px){ .impact-section-lite,.legacy-section,.journey-section,.people-section,.volunteer-section,.gallery-section-lite,.accountability-section,.faq-section-lite,.yellow-cta{ padding:62px 0; }.volunteer-panel,.cta-card > div{ padding:26px; }.avatar-card{ flex-basis:150px; }.avatar-photo{ height:168px; } }
        @media (prefers-reduced-motion: reduce){ .home-sections *{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; filter:none !important; } .home-sections::before{ display:none; } }
      `}</style>
    </div>
  );
}
