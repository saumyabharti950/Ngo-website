import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Causes from "./components/Causes";
import Campaigns from "./components/Campaigns";
import Footer from "./components/Footer";
import ContentSections from "./components/ContentSections";
import SitePage from "./components/SitePage";
import DonationPage from "./components/DonationPage";

function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const isHome = path === "/";

  return (
    <>
      <Navbar />
      <main>
        {isHome ? <>
          <Hero />
          <Stats />
          <Causes />
          <Campaigns />
          <ContentSections />
        </> : path === "/donate" ? <DonationPage /> : <SitePage path={path} />}
      </main>
      <Footer />
    </>
  );
}

export default App;
