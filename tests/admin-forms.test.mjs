import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { settingFields, labelize } from "../shared/settings.js";
import { bannerPages, validateSlider } from "../shared/pageSliders.js";

let server;
let CrudModal;
let SettingsFields, SettingsPanel, ContentCards, SiteSettingsContext, Footer, PageSliderEditor;
const meta = { roles: [{ id: 1, name: "Editor" }], permissions: [{ id: 1, slug: "gallery.view" }] };

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, watch: null },
    plugins: [{
      name: "admin-form-test-exports",
      transform(code, id) {
        if (id.replaceAll("\\", "/").endsWith("/src/components/AdminDashboard.jsx")) {
          return `${code}\nexport { CrudModal, SettingsFields, SettingsPanel };`;
        }
        if (id.replaceAll("\\", "/").endsWith("/src/context/SiteSettingsContext.jsx")) return `${code}\nexport { SiteSettingsContext };`;
      }
    }]
  });
  ({ CrudModal, SettingsFields, SettingsPanel } = await server.ssrLoadModule("/src/components/AdminDashboard.jsx"));
  ({ ContentCards } = await server.ssrLoadModule("/src/components/PublishedContent.jsx"));
  ({ SiteSettingsContext } = await server.ssrLoadModule("/src/context/SiteSettingsContext.jsx"));
  ({ default: Footer } = await server.ssrLoadModule("/src/components/Footer.jsx"));
  ({ default: PageSliderEditor } = await server.ssrLoadModule("/src/components/PageSliderEditor.jsx"));
});

after(async () => { await server?.close(); });

for (const group of Object.keys(settingFields)) {
  test(`settings: ${group} renders only its own fields and saved values`, () => {
    const values = Object.fromEntries(settingFields[group].map((key) => [key, key === "announcement_status" ? "active" : key.includes("logo") || key.includes("image") || key.startsWith("banner_") ? "/uploads/settings/test.png" : `Saved ${key}`]));
    const html = renderToStaticMarkup(createElement(SettingsFields, { active: group, values, update() {} }));
    for (const key of settingFields[group]) assert.ok(html.includes(labelize(key)), `${group} is missing ${key}`);
    if (group !== "general") assert.ok(!html.includes("Website Name"));
    if (group !== "header") assert.ok(!html.includes("Header Phone"));
    assert.ok(!html.includes("razorpay_key_id"));
  });
}

test("settings start with saved general values and separate tabs", () => {
  const html = renderToStaticMarkup(createElement(SettingsPanel, { data: { general: { website_name: "Saved Foundation" } } }));
  assert.match(html, /value="Saved Foundation"/);
  assert.equal((html.match(/role="tab"/g) || []).length, Object.keys(settingFields).length);
  assert.ok(!html.includes("Header Phone"));
});

test("CMS cards use backend content and backend upload origin", () => {
  const html = renderToStaticMarkup(createElement(ContentCards, { module: "gallery", items: [{ id: 1, slug: "saved-gallery", title: "Saved Gallery", shortDescription: "Saved description", featuredImage: "/uploads/gallery/photo.png" }] }));
  assert.match(html, /Saved Gallery/);
  assert.match(html, /Saved description/);
  assert.match(html, /http:\/\/localhost:5000\/uploads\/gallery\/photo.png/);
  assert.match(html, /href="\/gallery\/saved-gallery"/);
});

test("footer uses the saved name, address, content, social and policy links", () => {
  const settings = { general: { website_name: "Saved Foundation", copyright_text: "Saved Copyright" }, footer: { footer_content: "Saved Footer", privacy_policy_url: "/privacy" }, contact: { address: "Saved Address", primary_email: "saved@example.test", phone: "12345" }, social: { facebook: "https://example.test/social" } };
  const html = renderToStaticMarkup(createElement(SiteSettingsContext.Provider, { value: { settings } }, createElement(Footer)));
  for (const text of ["Saved Foundation", "Saved Copyright", "Saved Footer", "Saved Address", "saved@example.test", "https://example.test/social", 'href="/privacy"']) assert.ok(html.includes(text));
});

test("page banners cover public pages and validate image, copy and CTA links", () => {
  assert.ok(bannerPages.some((item) => item.path === "/gallery"));
  assert.ok(bannerPages.some((item) => item.path === "/programmes"));
  const valid = { enabled: true, slides: [{ id: "one", image: "/uploads/banners/one.png", alt: "Banner", eyebrow: "NEWS", title: "Heading", description: "Text", buttonText: "Read", buttonUrl: "/blog", align: "left" }] };
  assert.equal(validateSlider(valid), "");
  assert.match(validateSlider({ ...valid, slides: [{ ...valid.slides[0], buttonUrl: "javascript:alert(1)" }] }), /button link/);
});

test("page banner editor offers page selection, plus slide action and a website preview", () => {
  const html = renderToStaticMarkup(createElement(PageSliderEditor, { data: {}, canEdit: true }));
  assert.match(html, /Website page/);
  assert.match(html, /Add slide/);
  assert.match(html, /Selected page preview/);
  assert.match(html, /No slides yet/);
  assert.match(html, /src="\/preview"/);
});

for (const module of ["gallery", "programmes", "impact_stories", "blogs"]) {
  for (const mode of ["create", "view", "edit"]) {
    test(`${module}: ${mode} form opens with image fields`, () => {
      const html = renderToStaticMarkup(createElement(CrudModal, {
        modal: { type: "content", mode, config: { module, title: module }, row: { title: "Example", featuredImage: "/uploads/example.png" } },
        meta, close() {}, done() {}
      }));
      assert.match(html, /role="dialog"/);
      assert.match(html, /Basic details/);
      assert.match(html, /Images &amp; media/);
      assert.match(html, /Review &amp; publish/);
      assert.match(html, /LIVE PREVIEW/);
      assert.match(html, new RegExp(`${module === "impact_stories" ? "Impact Stories" : module[0].toUpperCase() + module.slice(1)} website preview`));
      assert.match(html, /src="\/preview"/);
      assert.match(html, mode === "view" ? /disabled=""/ : />Next/);
    });
  }
}

for (const type of ["user", "role", "permission"]) {
  for (const mode of ["create", "view", "edit"]) {
    test(`${type}: ${mode} form opens`, () => {
      const html = renderToStaticMarkup(createElement(CrudModal, {
        modal: { type, mode, row: {} }, meta, close() {}, done() {}
      }));
      assert.match(html, /role="dialog"/);
      assert.match(html, new RegExp(`${mode} ${type}`));
    });
  }
}
