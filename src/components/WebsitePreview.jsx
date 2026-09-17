import { useCallback, useEffect, useRef, useState } from "react";

export default function WebsitePreview({ payload, title = "Website preview" }) {
  const frame = useRef(null);
  const [view, setView] = useState("desktop");
  const [ready, setReady] = useState(false);
  const send = useCallback(() => frame.current?.contentWindow?.postMessage({ type: "sifi:preview:update", payload }, window.location.origin), [payload]);
  useEffect(() => { if (ready) send(); }, [ready, send]);
  return <aside className={`website-preview ${view}`}>
    <div className="website-preview-head"><div><span>LIVE PREVIEW</span><h2>{title}</h2></div><div className="preview-devices"><button type="button" className={view === "desktop" ? "active" : ""} onClick={() => setView("desktop")}>Desktop</button><button type="button" className={view === "mobile" ? "active" : ""} onClick={() => setView("mobile")}>Mobile</button></div></div>
    <div className="website-preview-frame"><iframe ref={frame} title={title} src="/preview" onLoad={() => { setReady(true); send(); }} /></div>
  </aside>;
}
