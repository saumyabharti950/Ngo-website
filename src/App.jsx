import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Causes from "./components/Causes";
import Campaigns from "./components/Campaigns";
import Footer from "./components/Footer";
import ContentSections from "./components/ContentSections";
import SitePage from "./components/SitePage";
import DonationPage from "./components/DonationPage";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

const getCurrentPath = () => window.location.pathname.replace(/\/$/, "") || "/";

function App() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleNavigation = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http") || href.startsWith("//")) {
        return;
      }

      const nextPath = new URL(href, window.location.origin).pathname.replace(/\/$/, "") || "/";
      if (nextPath === window.location.pathname.replace(/\/$/, "") || nextPath === window.location.pathname) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", href);
      setPath(nextPath);
    };

    const handlePopState = () => setPath(getCurrentPath());
    window.addEventListener("click", handleNavigation);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleNavigation);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const isHome = path === "/";
  const isAdmin = path.startsWith("/admin");

  return (
    <AuthProvider>
      {isAdmin ? <AdminDashboard path={path} /> : (
        <>
          <Navbar />
          <main>
            {isHome ? (
              <>
                <Hero />
                <Stats />
                <Causes />
                <Campaigns />
                <ContentSections />
              </>
            ) : path === "/donate" ? (
              <DonationPage />
            ) : path === "/login" ? (
              <LoginPage />
            ) : (
              <SitePage path={path} />
            )}
          </main>
          <Footer />
        </>
      )}
    </AuthProvider>
  );
}

export default App;
