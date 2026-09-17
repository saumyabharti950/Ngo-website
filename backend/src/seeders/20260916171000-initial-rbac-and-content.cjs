"use strict";

const bcrypt = require("bcryptjs");

const now = new Date();
const roles = ["Super Admin", "Admin", "Manager", "Staff", "User", "Donor"].map((name) => ({
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  description: `${name} role`,
  status: "active",
  created_at: now,
  updated_at: now
}));

const matrix = {
  users: ["view", "create", "edit", "delete", "status", "permissions"],
  roles: ["view", "create", "edit", "delete"],
  permissions: ["view", "create", "edit", "delete"],
  gallery: ["view", "create", "edit", "delete", "publish", "unpublish"],
  programmes: ["view", "create", "edit", "delete", "publish", "unpublish"],
  impact_stories: ["view", "create", "edit", "delete", "publish", "unpublish"],
  blogs: ["view", "create", "edit", "delete", "publish", "unpublish"],
  settings: ["view", "edit"],
  contact_messages: ["view", "read", "archive", "delete"],
  donations: ["view", "details", "invoice", "export"],
  transactions: ["view", "details", "export"]
};

const permissions = Object.entries(matrix).flatMap(([module, actions]) => actions.map((action) => ({
  name: `${module.replaceAll("_", " ")} ${action}`,
  slug: `${module}.${action}`,
  module,
  action,
  status: "active",
  created_at: now,
  updated_at: now
})));

const settings = [
  ["general", "website_name", "Social Initiative for India Foundation"],
  ["general", "website_title", "SIFI Foundation"],
  ["general", "tagline", "Health | Learn | Skill | Earn"],
  ["general", "copyright_text", "Social Initiative for India Foundation. All Rights Reserved."],
  ["header", "header_phone", "0651-3591618"],
  ["header", "header_email", "info@sififoundation.org"],
  ["footer", "footer_content", "Creating opportunities and strengthening communities."],
  ["contact", "primary_email", "info@sififoundation.org"],
  ["contact", "phone", "0651-3591618"],
  ["contact", "address", "C/22, Patel Park, Harmu Housing Colony, Ranchi - 834002, Jharkhand, India"],
  ["social", "facebook", "https://www.facebook.com/sififoundation"],
  ["social", "instagram", "https://www.instagram.com/sififoundation"],
  ["social", "linkedin", "https://www.linkedin.com/company/sifi-foundation"],
  ["social", "youtube", "https://www.youtube.com/@sififoundation"]
].map(([group, key, value]) => ({ group, key, value, type: "text", created_at: now, updated_at: now }));

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", roles);
    await queryInterface.bulkInsert("permissions", permissions);
    const [roleRows] = await queryInterface.sequelize.query("SELECT id, slug FROM roles");
    const [permissionRows] = await queryInterface.sequelize.query("SELECT id FROM permissions");
    const superRole = roleRows.find((role) => role.slug === "super-admin");
    await queryInterface.bulkInsert("role_permissions", permissionRows.map((permission) => ({ role_id: superRole.id, permission_id: permission.id })));
    await queryInterface.bulkInsert("settings", settings);
    await queryInterface.bulkInsert("blog_categories", [{ name: "Field Notes", slug: "field-notes", description: "Updates from the ground", status: "active", created_at: now, updated_at: now }]);
    const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!", 12);
    await queryInterface.bulkInsert("users", [{
      role_id: superRole.id,
      name: process.env.SUPER_ADMIN_NAME || "Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL || "admin@sififoundation.org",
      password,
      status: "active",
      email_verified_at: now,
      created_at: now,
      updated_at: now
    }]);
    const [adminRows] = await queryInterface.sequelize.query("SELECT id FROM users LIMIT 1");
    const adminId = adminRows[0].id;
    await queryInterface.bulkInsert("contents", [
      { module: "programmes", title: "Education and Digital Learning", slug: "education-and-digital-learning", short_description: "Learning support and digital access for children and young people.", description: "Community learning programmes that improve access, confidence and continuity.", featured_image: "/images/education.jpg", status: "published", featured: true, published_at: now, created_by: adminId, updated_by: adminId, created_at: now, updated_at: now },
      { module: "gallery", title: "Community Health Outreach", slug: "community-health-outreach", short_description: "Moments from community health awareness activities.", featured_image: "/images/healthcare.jpg", image1: "/images/healthcare.jpg", image2: "/images/volunteer.jpg", status: "published", featured: true, published_at: now, created_by: adminId, updated_by: adminId, created_at: now, updated_at: now },
      { module: "impact_stories", title: "Women Leading Local Change", slug: "women-leading-local-change", short_description: "Skills and awareness helping women participate with confidence.", description: "A story of community participation, support and new possibilities.", featured_image: "/images/elderly.jpg", status: "published", featured: true, published_at: now, created_by: adminId, updated_by: adminId, created_at: now, updated_at: now },
      { module: "blogs", title: "Why Local Voices Matter", slug: "why-local-voices-matter", short_description: "Community insight is the starting point for sustainable development.", content: "Sustainable programmes begin by listening carefully to people closest to the challenge.", featured_image: "/images/Blog.png", status: "published", featured: true, published_at: now, created_by: adminId, updated_by: adminId, created_at: now, updated_at: now }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("contents", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("blog_categories", null, {});
    await queryInterface.bulkDelete("settings", null, {});
    await queryInterface.bulkDelete("role_permissions", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  }
};
