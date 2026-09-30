"use strict";

const now = "CURRENT_TIMESTAMP";
const permissions = [
  ["Careers View", "careers.view", "careers", "view"],
  ["Careers Create", "careers.create", "careers", "create"],
  ["Careers Edit", "careers.edit", "careers", "edit"],
  ["Careers Delete", "careers.delete", "careers", "delete"],
  ["Career Applications View", "career_applications.view", "career_applications", "view"],
  ["Career Applications Edit", "career_applications.edit", "career_applications", "edit"],
  ["Notices View", "notices.view", "notices", "view"],
  ["Notices Create", "notices.create", "notices", "create"],
  ["Notices Edit", "notices.edit", "notices", "edit"],
  ["Notices Delete", "notices.delete", "notices", "delete"]
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("career_posts", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" }, onDelete: "SET NULL" },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      department: Sequelize.STRING,
      job_type: { type: Sequelize.STRING, defaultValue: "Full-time" },
      work_mode: { type: Sequelize.STRING, defaultValue: "On-site" },
      location: Sequelize.STRING,
      salary_min: Sequelize.DECIMAL(12, 2),
      salary_max: Sequelize.DECIMAL(12, 2),
      currency: { type: Sequelize.STRING(3), defaultValue: "INR" },
      experience_level: Sequelize.STRING,
      openings: { type: Sequelize.INTEGER, defaultValue: 1 },
      summary: Sequelize.TEXT,
      description: Sequelize.TEXT("long"),
      responsibilities: Sequelize.TEXT("long"),
      qualifications: Sequelize.TEXT("long"),
      skills: Sequelize.TEXT,
      benefits: Sequelize.TEXT,
      application_email: Sequelize.STRING,
      apply_url: Sequelize.STRING,
      deadline: Sequelize.DATEONLY,
      status: { type: Sequelize.ENUM("draft", "published", "closed"), defaultValue: "draft" },
      featured: { type: Sequelize.BOOLEAN, defaultValue: false },
      published_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("career_applications", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      career_post_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "career_posts", key: "id" }, onDelete: "CASCADE" },
      applicant_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: Sequelize.STRING,
      current_location: Sequelize.STRING,
      experience_years: Sequelize.DECIMAL(4, 1),
      current_company: Sequelize.STRING,
      current_ctc: Sequelize.STRING,
      expected_ctc: Sequelize.STRING,
      notice_period: Sequelize.STRING,
      cover_letter: Sequelize.TEXT,
      resume_url: { type: Sequelize.STRING, allowNull: false },
      portfolio_url: Sequelize.STRING,
      linkedin_url: Sequelize.STRING,
      status: { type: Sequelize.ENUM("new", "reviewing", "shortlisted", "interview", "selected", "rejected", "hold"), defaultValue: "new" },
      admin_note: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.bulkInsert("permissions", permissions.map(([name, slug, module, action]) => ({
      name, slug, module, action, status: "active", created_at: Sequelize.literal(now), updated_at: Sequelize.literal(now)
    })));
    await queryInterface.sequelize.query(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
      WHERE r.slug = 'super-admin' AND p.slug IN (${permissions.map((permission) => `'${permission[1]}'`).join(",")});
    `);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("career_applications");
    await queryInterface.dropTable("career_posts");
    await queryInterface.bulkDelete("permissions", { slug: permissions.map((permission) => permission[1]) });
  }
};
