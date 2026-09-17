import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const PageSlidersContext = createContext({});
export function PageSlidersProvider({ children }) {
  const [sliders, setSliders] = useState({});
  useEffect(() => {
    let current = true;
    const load = () => api("/page-sliders").then((data) => { if (current) setSliders(data); }).catch(() => {});
    load();
    window.addEventListener("focus", load);
    window.addEventListener("page-sliders-updated", load);
    return () => { current = false; window.removeEventListener("focus", load); window.removeEventListener("page-sliders-updated", load); };
  }, []);
  return <PageSlidersContext.Provider value={sliders}>{children}</PageSlidersContext.Provider>;
}
export const usePageSliders = () => useContext(PageSlidersContext);
