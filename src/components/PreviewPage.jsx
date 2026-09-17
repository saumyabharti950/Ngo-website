import { useEffect, useState } from "react";
import PublicWebsite from "./PublicWebsite";
import { bannerPages } from "../../shared/pageSliders";
import { contentPaths } from "../../shared/content";

export default function PreviewPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const receive = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.source === window) return;
      const next = event.data?.payload;
      if (event.data?.type !== "sifi:preview:update" || !next) return;
      if (next.kind === "banner" && !bannerPages.some((page) => page.path === next.path)) return;
      if (next.kind === "content" && !Object.hasOwn(contentPaths, next.item?.module || "")) return;
      if (!["banner", "content"].includes(next.kind)) return;
      setData(next);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "sifi:preview:ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  return data ? <PublicWebsite path={data.path} previewData={data} /> : <div className="preview-waiting"><h1>Website preview</h1><p>Open a CMS entry or Page Banners in the admin panel to preview your changes here.</p></div>;
}
