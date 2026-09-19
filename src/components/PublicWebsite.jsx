import Navbar from "./Navbar";
import Footer from "./Footer";
import Hero from "./Hero";
import Stats from "./Stats";
import Campaigns from "./Campaigns";
import ContentSections from "./ContentSections";
import SitePage from "./SitePage";
import DonationPage from "./DonationPage";
import LoginPage from "./LoginPage";
import ContentDetailView from "./ContentDetailView";
import PageBanner from "./PageBanner";
import { usePageSliders } from "../context/PageSlidersContext";
import { bannerPagePath } from "../../shared/pageSliders";

export default function PublicWebsite({ path, previewData }) {
  const sliders = usePageSliders();
  const bannerPath = bannerPagePath(path);
  const slider = previewData?.kind === "banner" ? previewData.slider : sliders[bannerPath];
  const showSlider = slider?.enabled && slider.slides?.length > 0;
  const preview = Boolean(previewData);
  const preventAction = (event) => { event.preventDefault(); event.stopPropagation(); };
  return <div className="public-website" onClickCapture={preview ? (event) => { if (event.target.closest("a")) preventAction(event); } : undefined} onSubmitCapture={preview ? preventAction : undefined}>
    <Navbar preview={preview} path={path} />
    <main>
      {showSlider && <PageBanner key={`${bannerPath}:${previewData?.activeSlide || 0}`} slides={slider.slides} initialIndex={previewData?.activeSlide || 0} preview={preview} />}
      {previewData?.kind === "content" && previewData.view !== "listing" ? <ContentDetailView item={previewData.item} /> : path === "/" ? <>
        {!showSlider && <Hero />}<Stats /><Campaigns /><ContentSections />
      </> : path === "/donate" ? <DonationPage /> : path === "/login" ? <LoginPage /> : <SitePage path={path} previewContent={previewData?.kind === "content" ? previewData.item : undefined} />}
    </main>
    <Footer />
  </div>;
}
