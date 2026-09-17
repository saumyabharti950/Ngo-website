import { createContext, useContext, useEffect, useState } from "react";
import { api, assetUrl } from "../lib/api";
import { safeUrl } from "../../shared/settings";

const SiteSettingsContext = createContext({ settings: {}, refresh: async () => {} });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const refresh = async () => {
    const next = await api("/settings");
    setSettings(next || {});
  };
  useEffect(() => {
    const reload = () => { refresh().catch(() => {}); };
    reload();
    window.addEventListener("focus", reload);
    window.addEventListener("settings-updated", reload);
    return () => { window.removeEventListener("focus", reload); window.removeEventListener("settings-updated", reload); };
  }, []);
  useEffect(() => {
    const general = settings.general || {};
    const seo = settings.seo || {};
    document.title = seo.meta_title || general.website_title || "SIFI Foundation";
    const fields = {
      description: seo.meta_description ?? general.website_description,
      keywords: seo.meta_keywords, robots: seo.robots, author: seo.author,
      "og:title": seo.og_title || seo.meta_title || general.website_title,
      "og:description": seo.og_description ?? seo.meta_description ?? general.website_description,
      "og:image": seo.og_image ? assetUrl(seo.og_image) : "",
      "twitter:title": seo.twitter_title || seo.meta_title || general.website_title,
      "twitter:description": seo.twitter_description ?? seo.meta_description ?? general.website_description,
      "twitter:image": seo.twitter_image ? assetUrl(seo.twitter_image) : ""
    };
    for (const [name, value] of Object.entries(fields)) {
      const attr = name.startsWith("og:") ? "property" : "name";
      let node = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!value) { node?.remove(); continue; }
      if (!node) { node = document.createElement("meta"); node.setAttribute(attr, name); document.head.appendChild(node); }
      node.content = value;
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (safeUrl(seo.canonical_url)) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = seo.canonical_url;
    } else canonical?.remove();
  }, [settings]);
  return <SiteSettingsContext.Provider value={{ settings, refresh }}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
