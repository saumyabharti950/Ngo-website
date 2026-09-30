-- Careers, notices, donation modal support, and enhanced gallery setup.
-- Run after the existing core schema. Sequelize migration equivalent:
-- backend/src/migrations/20260930120000-careers-notices-gallery-updates.cjs

CREATE TABLE IF NOT EXISTS career_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_by INT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(255) NULL,
  job_type VARCHAR(255) DEFAULT 'Full-time',
  work_mode VARCHAR(255) DEFAULT 'On-site',
  location VARCHAR(255) NULL,
  salary_min DECIMAL(12,2) NULL,
  salary_max DECIMAL(12,2) NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  experience_level VARCHAR(255) NULL,
  openings INT DEFAULT 1,
  summary TEXT NULL,
  description LONGTEXT NULL,
  responsibilities LONGTEXT NULL,
  qualifications LONGTEXT NULL,
  skills TEXT NULL,
  benefits TEXT NULL,
  application_email VARCHAR(255) NULL,
  apply_url VARCHAR(255) NULL,
  deadline DATE NULL,
  status ENUM('draft','published','closed') DEFAULT 'draft',
  featured TINYINT(1) DEFAULT 0,
  published_at DATETIME NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  CONSTRAINT career_posts_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS career_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  career_post_id INT NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
  current_location VARCHAR(255) NULL,
  experience_years DECIMAL(4,1) NULL,
  current_company VARCHAR(255) NULL,
  current_ctc VARCHAR(255) NULL,
  expected_ctc VARCHAR(255) NULL,
  notice_period VARCHAR(255) NULL,
  cover_letter TEXT NULL,
  resume_url VARCHAR(255) NOT NULL,
  portfolio_url VARCHAR(255) NULL,
  linkedin_url VARCHAR(255) NULL,
  status ENUM('new','reviewing','shortlisted','interview','selected','rejected','hold') DEFAULT 'new',
  admin_note TEXT NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  CONSTRAINT career_applications_post_fk FOREIGN KEY (career_post_id) REFERENCES career_posts(id) ON DELETE CASCADE
);

-- If your contents.module ENUM does not yet include notices, run the ALTER.
ALTER TABLE contents MODIFY module ENUM('gallery','programmes','impact_stories','blogs','notices') NOT NULL;

INSERT IGNORE INTO permissions (name, slug, module, action, status, created_at, updated_at) VALUES
('Careers View','careers.view','careers','view','active',NOW(),NOW()),
('Careers Create','careers.create','careers','create','active',NOW(),NOW()),
('Careers Edit','careers.edit','careers','edit','active',NOW(),NOW()),
('Careers Delete','careers.delete','careers','delete','active',NOW(),NOW()),
('Career Applications View','career_applications.view','career_applications','view','active',NOW(),NOW()),
('Career Applications Edit','career_applications.edit','career_applications','edit','active',NOW(),NOW()),
('Notices View','notices.view','notices','view','active',NOW(),NOW()),
('Notices Create','notices.create','notices','create','active',NOW(),NOW()),
('Notices Edit','notices.edit','notices','edit','active',NOW(),NOW()),
('Notices Delete','notices.delete','notices','delete','active',NOW(),NOW());

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'super-admin'
  AND p.slug IN (
    'careers.view','careers.create','careers.edit','careers.delete',
    'career_applications.view','career_applications.edit',
    'notices.view','notices.create','notices.edit','notices.delete'
  );

-- Enhanced gallery media is stored in contents.payload as JSON:
-- {"media":[{"id":"...","type":"image","url":"/uploads/gallery/a.webp","title":"Community moment"},
--           {"id":"...","type":"video","url":"/uploads/videos/clip.mp4","title":"Field video"},
--           {"id":"...","type":"embed","url":"https://www.youtube.com/watch?v=...","title":"YouTube update"}]}
