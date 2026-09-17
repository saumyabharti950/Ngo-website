import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import PublicWebsite from "./components/PublicWebsite";
import PreviewPage from "./components/PreviewPage";
import { AuthProvider } from "./context/AuthContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { PageSlidersProvider } from "./context/PageSlidersContext";

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
  const isPreview = path === "/preview";

  return (
    <AuthProvider><SiteSettingsProvider><PageSlidersProvider>
      {isPreview ? <PreviewPage /> : isAdmin ? <AdminDashboard key={path} path={path} /> : <PublicWebsite path={isHome ? "/" : path} />}
    </PageSlidersProvider></SiteSettingsProvider></AuthProvider>
  );
}

export default App;
