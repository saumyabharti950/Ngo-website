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
import NoticeStrip from "./NoticeStrip";
import { usePageSliders } from "../context/PageSlidersContext";
import { bannerPagePath } from "../../shared/pageSliders";
import { useState } from "react";

export default function PublicWebsite({ path, previewData }) {
  const [donationModal, setDonationModal] = useState(false);
  const sliders = usePageSliders();
  const bannerPath = bannerPagePath(path);
  const slider = previewData?.kind === "banner" ? previewData.slider : sliders[bannerPath];
  const showSlider = slider?.enabled && slider.slides?.length > 0;
  const preview = Boolean(previewData);
  const preventAction = (event) => { event.preventDefault(); event.stopPropagation(); };
  const handleClick = (event) => {
    if (preview && event.target.closest("a")) return preventAction(event);
    const donateLink = event.target.closest('a[href="/donate"], a[href$="/donate"]');
    if (!donateLink || donateLink.closest(".navbar")) return;
    event.preventDefault();
    setDonationModal(true);
  };
  return <div className="public-website" onClickCapture={handleClick} onSubmitCapture={preview ? preventAction : undefined}>
    <Navbar preview={preview} path={path} />
    <main>
      {showSlider && <PageBanner key={`${bannerPath}:${previewData?.activeSlide || 0}`} slides={slider.slides} initialIndex={previewData?.activeSlide || 0} preview={preview} />}
      {previewData?.kind === "content" && previewData.view !== "listing" ? <ContentDetailView item={previewData.item} /> : path === "/" ? <>
        {!showSlider && <Hero />}<NoticeStrip /><Stats /><Campaigns /><ContentSections />
      </> : path === "/donate" ? <DonationPage /> : path === "/login" ? <LoginPage /> : <SitePage path={path} previewContent={previewData?.kind === "content" ? previewData.item : undefined} />}
    </main>
    <Footer />
    {donationModal && <DonationPage modal onClose={() => setDonationModal(false)} />}
  </div>;
}
