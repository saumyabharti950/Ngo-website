-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 09:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ngo_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `record_id` varchar(255) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Field Notes', 'field-notes', 'Updates from the ground', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(2, 'Community Development', 'community-development', 'SIFI Foundation articles on community development.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(3, 'Development Priorities', 'development-priorities', 'SIFI Foundation articles on development priorities.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(4, 'Partnerships', 'partnerships', 'SIFI Foundation articles on partnerships.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(5, 'Research and Impact', 'research-and-impact', 'SIFI Foundation articles on research and impact.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(6, 'Community Institutions', 'community-institutions', 'SIFI Foundation articles on community institutions.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(7, 'Foundation Updates', 'foundation-updates', 'SIFI Foundation articles on foundation updates.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL),
(8, 'Get Involved', 'get-involved', 'SIFI Foundation articles on get involved.', 'active', '2026-09-17 18:30:35', '2026-09-17 18:30:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` enum('unread','read','archived') DEFAULT 'unread',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `ip_address`, `user_agent`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ajay Kumar', 'ajayfilliptect@gmail.com', '08863897163', '', 'hj,hk,jkjk.jk.j', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'read', '2026-09-17 19:28:26', '2026-09-17 19:28:47');

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `module` enum('gallery','programmes','impact_stories','blogs') NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `image3` varchar(255) DEFAULT NULL,
  `image4` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `document_file` varchar(255) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `status` enum('draft','published','unpublished','scheduled') DEFAULT 'draft',
  `featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `category_id`, `created_by`, `updated_by`, `module`, `title`, `slug`, `short_description`, `description`, `content`, `category`, `tags`, `meta_title`, `meta_description`, `featured_image`, `image1`, `image2`, `image3`, `image4`, `video_url`, `document_file`, `payload`, `status`, `featured`, `sort_order`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 1, 1, 'programmes', 'Education and Digital Learning', 'education-and-digital-learning', 'Connect education support, literacy and digital inclusion so learners can participate with confidence.', 'Connect education support, literacy and digital inclusion so learners can participate with confidence.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Education & Digital Learning\n\nCreating pathways to learning, literacy and educational opportunity.\nOur focus includes:\n•	School education support\n•	Digital learning\n•	Literacy\n•	Libraries and learning centres\n•	Educational assistance\n•	Scholarships and study materials\n•	Digital education\n•	Learning support for disadvantaged communities\n\nTechnology & Digital Inclusion\n\nUsing technology to improve access to education, healthcare, skills, information, research and community services.\nThe Foundation\'s objects permit development of websites, mobile applications, digital platforms, online learning systems and databases for charitable purposes.\n\nWho the programme is designed to support\nChildren, young people and disadvantaged learners facing educational or digital access barriers.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: More accessible learning resources, greater digital confidence and stronger continuity of learning.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Education & Digital Learning', '[\"Education & Digital Learning\",\"SIFI Foundation\",\"Community-led development\"]', 'Education and Digital Learning', 'Connect education support, literacy and digital inclusion so learners can participate with confidence.', '/uploads/programmes/f2926a0f-27ab-4a04-9f1f-7a30ecd6f8d0.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Connect education support, literacy and digital inclusion so learners can participate with confidence.\",\"objectives\":\"Connect education support, literacy and digital inclusion so learners can participate with confidence.\",\"targetBeneficiaries\":\"Children, young people and disadvantaged learners facing educational or digital access barriers.\",\"keyActivities\":\"Creating pathways to learning, literacy and educational opportunity.\\nOur focus includes:\\n•\\tSchool education support\\n•\\tDigital learning\\n•\\tLiteracy\\n•\\tLibraries and learning centres\\n•\\tEducational assistance\\n•\\tScholarships and study materials\\n•\\tDigital education\\n•\\tLearning support for disadvantaged communities\\n\\nUsing technology to improve access to education, healthcare, skills, information, research and community services.\\nThe Foundation\'s objects permit development of websites, mobile applications, digital platforms, online learning systems and databases for charitable purposes.\",\"outcomes\":\"Intended outcomes: More accessible learning resources, greater digital confidence and stronger continuity of learning.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 1, 2, '2026-09-16 18:03:13', '2026-09-16 18:03:13', '2026-09-17 18:51:30', NULL),
(2, NULL, 1, 1, 'gallery', 'Community Health Outreach', 'community-health-outreach', 'Moments from community health awareness activities.', NULL, NULL, NULL, NULL, NULL, NULL, '/uploads/gallery/9736206d-0b3e-4e59-b1b7-6de1df23f13f.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"images\":[{\"id\":\"legacy-0\",\"url\":\"/uploads/gallery/9736206d-0b3e-4e59-b1b7-6de1df23f13f.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"legacy-1\",\"url\":\"/uploads/gallery/99333a4c-a49c-4f39-b14c-15b1438c0023.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"1c325869-2917-4181-818c-46cccd77ffee\",\"url\":\"/uploads/gallery/653d9689-0999-4af5-9f92-eaec891b8ac9.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"76a93f2f-097c-4e4e-afed-d73447f20359\",\"url\":\"/uploads/gallery/a26fb195-f050-4a85-b59c-8b687916f94c.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"0af3e0fe-d7d3-466a-a041-ad2c9b2277c8\",\"url\":\"/uploads/gallery/82a672d2-7bb3-4b02-a676-82b012a71802.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"df4aba6c-bb8d-498f-b3a3-e22401c17821\",\"url\":\"/uploads/gallery/2b21faa2-6279-46cc-aac3-20908bad1409.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"17046c1f-3f43-4127-9027-55f9cfd9d01c\",\"url\":\"/uploads/gallery/1166e53e-a2f8-4c34-a4c7-305cfc689032.png\",\"title\":\"Community Health Outreach\"},{\"id\":\"ca350b15-da73-47a7-a756-37f300f7152c\",\"url\":\"/uploads/gallery/9c7c23bf-775c-4b76-879a-cc98eff892c8.png\",\"title\":\"Community Health Outreach\"}]}', 'published', 1, 0, '2026-09-16 18:03:13', '2026-09-16 18:03:13', '2026-09-17 19:27:31', NULL),
(3, NULL, 1, 1, 'impact_stories', 'Women Creating Change', 'women-leading-local-change', 'Impact pathway: Education, enterprise and leadership opportunities can strengthen women’s participation in community life.', 'This is a programme-based impact pathway drawn from the Foundation’s profile, not a verified individual beneficiary case study.', 'Women’s participation can be affected by interconnected gaps in education, healthcare, skills and financial inclusion. A community-based approach considers these needs together.\n\nThe Foundation’s empowerment focus connects skills and entrepreneurship with awareness, financial inclusion and leadership development.\n\nThe pathway centres women’s own priorities, builds practical capabilities and considers whether participation in livelihood and community opportunities becomes more accessible.\n\nEvidence for a future field story would include a documented starting point, the support provided, participant consent and verified outcomes. The Foundation’s impact framework asks what changed, who could participate and whether benefits can continue.', 'Impact Pathways', '[\"Impact Pathways\",\"SIFI Foundation\",\"Community-led development\"]', 'Women Creating Change', 'Impact pathway: Education, enterprise and leadership opportunities can strengthen women’s participation in community life.', '/uploads/impact_stories/17010ba0-c5d3-4245-a39c-c66ce374dc5c.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"background\":\"Women’s participation can be affected by interconnected gaps in education, healthcare, skills and financial inclusion. A community-based approach considers these needs together.\",\"challenge\":\"Women’s participation can be affected by interconnected gaps in education, healthcare, skills and financial inclusion. A community-based approach considers these needs together.\",\"intervention\":\"The Foundation’s empowerment focus connects skills and entrepreneurship with awareness, financial inclusion and leadership development.\",\"supportProvided\":\"Programme focus: Women and Girl Empowerment\",\"journey\":\"The pathway centres women’s own priorities, builds practical capabilities and considers whether participation in livelihood and community opportunities becomes more accessible.\",\"impact\":\"Intended change: Education, enterprise and leadership opportunities can strengthen women’s participation in community life.\",\"result\":\"Verified beneficiary results are not supplied in the organisational profile.\",\"programmeId\":8}', 'published', 0, 4, '2026-09-16 18:03:13', '2026-09-16 18:03:13', '2026-09-17 19:15:57', NULL),
(4, 2, 1, 1, 'blogs', 'Why Local Voices Matter', 'why-local-voices-matter', 'How community knowledge, dignity and participation shape SIFI Foundation’s vision for inclusive development.', 'A useful development programme begins with a conversation. Before choosing an activity, communities need space to describe the barriers they face, the resources they already have and the future they want to build. For SIFI Foundation, this listening process connects a broad vision of inclusion with practical local decisions.', 'Building Pathways to Inclusive and Sustainable Development\nSocial Initiative for India Foundation (SIFI Foundation) is a Section 8 not-for-profit organisation committed to advancing inclusive, sustainable and community-led development.\nThe Foundation brings together field-level implementation, professional programme management, research, partnerships and community participation to address development challenges and create lasting opportunities for underserved and vulnerable communities.\nOur work spans healthcare and public health, education and digital learning, skill development, livelihoods, women and youth empowerment, agriculture, environmental sustainability, water and sanitation, community development, research and social impact assessment.\nWe believe that sustainable development begins with understanding communities, listening to their needs and working with them to create practical and measurable solutions.\nOur approach is simple:\nUnderstand → Plan → Partner → Implement → Measure → Learn → Scale\n\nDevelopment That Reaches People\nDevelopment is meaningful when it improves everyday life.\nFor us, social impact is not limited to delivering a programme or completing an activity. It is about improving access, strengthening capabilities, creating opportunities and enabling communities to become more resilient and self-reliant.\nWe work at the intersection of People, Services, Opportunities, Knowledge and Partnerships to create solutions that are relevant to local needs and capable of generating sustainable outcomes.\n\nOur Vision\nAn inclusive and sustainable India where every individual and community has the opportunity to live with health, dignity, knowledge, livelihood security and equal access to opportunities.\n\nOur Mission\nTo improve the quality of life of underserved and vulnerable communities by enabling equitable access to healthcare, education, livelihoods, skills, technology, essential services and sustainable development opportunities through inclusive, participatory and evidence-based interventions.\n\nDignity\nWe respect every individual and community and place human dignity at the centre of our work.\nInclusion\nWe strive to ensure that development opportunities reach people who are underserved, disadvantaged and vulnerable.\nIntegrity\nWe believe in ethical conduct, transparency and responsible stewardship of resources.\nParticipation\nWe work with communities rather than simply working for communities.\nSustainability\nWe seek solutions that create lasting social, economic and environmental value.\nEvidence\nWe use research, data, community feedback and monitoring to improve decision-making.\nCollaboration\nWe believe complex development challenges require partnerships across sectors.\nAccountability\nWe remain committed to responsible implementation, measurable outcomes and transparent reporting.\nInnovation\nWe encourage practical ideas, technology and new approaches that can improve development outcomes.\n\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.', 'Community Development', '[\"Community Development\",\"SIFI Foundation\",\"Community-led development\"]', 'Why Local Voices Matter', 'How community knowledge, dignity and participation shape SIFI Foundation’s vision for inclusive development.', '/uploads/blogs/352320f7-96ec-452a-a466-ff8c18000ebc.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 1, 1, '2026-09-16 18:03:13', '2026-09-16 18:03:13', '2026-09-17 19:05:09', NULL),
(5, NULL, 1, 1, 'programmes', 'Healthcare and Public Health', 'healthcare-and-public-health', 'Improve access to preventive, promotive and basic healthcare through community awareness and locally relevant support.', 'Improve access to preventive, promotive and basic healthcare through community awareness and locally relevant support.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Healthcare & Public Health\n\nImproving access to preventive, promotive and basic healthcare services for underserved communities.\nOur focus includes:\n•	Community healthcare\n•	Health camps and outreach\n•	Preventive healthcare\n•	Health awareness\n•	Nutrition awareness\n•	Maternal and community health\n•	Sanitation and hygiene\n•	Public health initiatives\n•	Healthcare facilities and support services\nThe Foundation’s constitutional objects specifically provide for charitable hospitals, healthcare centres, clinics, diagnostic centres, medical camps and preventive/public-health programmes.\n\nWho the programme is designed to support\nUnderserved communities, including mothers, children and people facing barriers to basic healthcare.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Improved access to health information and services; stronger awareness of nutrition, hygiene and preventive care.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Healthcare & Public Health', '[\"Healthcare & Public Health\",\"SIFI Foundation\",\"Community-led development\"]', 'Healthcare and Public Health', 'Improve access to preventive, promotive and basic healthcare through community awareness and locally relevant support.', '/uploads/programmes/72923352-bfd5-4894-b0b4-b9b2b4c7582f.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Improve access to preventive, promotive and basic healthcare through community awareness and locally relevant support.\",\"objectives\":\"Improve access to preventive, promotive and basic healthcare through community awareness and locally relevant support.\",\"targetBeneficiaries\":\"Underserved communities, including mothers, children and people facing barriers to basic healthcare.\",\"keyActivities\":\"Improving access to preventive, promotive and basic healthcare services for underserved communities.\\nOur focus includes:\\n•\\tCommunity healthcare\\n•\\tHealth camps and outreach\\n•\\tPreventive healthcare\\n•\\tHealth awareness\\n•\\tNutrition awareness\\n•\\tMaternal and community health\\n•\\tSanitation and hygiene\\n•\\tPublic health initiatives\\n•\\tHealthcare facilities and support services\\nThe Foundation’s constitutional objects specifically provide for charitable hospitals, healthcare centres, clinics, diagnostic centres, medical camps and preventive/public-health programmes.\",\"outcomes\":\"Intended outcomes: Improved access to health information and services; stronger awareness of nutrition, hygiene and preventive care.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 1, 1, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:39:36', NULL),
(6, NULL, 1, 1, 'programmes', 'Skill Development, Employment and Entrepreneurship', 'skill-development-employment-and-entrepreneurship', 'Build practical capabilities that connect young people and women with employment and enterprise opportunities.', 'Build practical capabilities that connect young people and women with employment and enterprise opportunities.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Skill Development, Employment & Entrepreneurship\n\nBuilding skills that connect people with employment, enterprise and economic opportunity.\nOur focus includes:\n•	Vocational training\n•	Technical training\n•	Employability enhancement\n•	Entrepreneurship development\n•	Youth skill development\n•	Women-focused skill programmes\n•	Capacity building\n•	Employment-oriented programmes\nThese areas are expressly included in the Foundation\'s objects, including vocational, technical, entrepreneurship and employment-oriented programmes.\n\nWho the programme is designed to support\nYouth, women and people seeking vocational, technical or employment-oriented skills.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Stronger vocational capabilities, improved employability and better preparation for enterprise.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Skill Development, Employment & Entrepreneurship', '[\"Skill Development, Employment & Entrepreneurship\",\"SIFI Foundation\",\"Community-led development\"]', 'Skill Development, Employment and Entrepreneurship', 'Build practical capabilities that connect young people and women with employment and enterprise opportunities.', '/uploads/programmes/d7a40355-73a3-440c-937a-20fa6d6a161f.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Build practical capabilities that connect young people and women with employment and enterprise opportunities.\",\"objectives\":\"Build practical capabilities that connect young people and women with employment and enterprise opportunities.\",\"targetBeneficiaries\":\"Youth, women and people seeking vocational, technical or employment-oriented skills.\",\"keyActivities\":\"Building skills that connect people with employment, enterprise and economic opportunity.\\nOur focus includes:\\n•\\tVocational training\\n•\\tTechnical training\\n•\\tEmployability enhancement\\n•\\tEntrepreneurship development\\n•\\tYouth skill development\\n•\\tWomen-focused skill programmes\\n•\\tCapacity building\\n•\\tEmployment-oriented programmes\\nThese areas are expressly included in the Foundation\'s objects, including vocational, technical, entrepreneurship and employment-oriented programmes.\",\"outcomes\":\"Intended outcomes: Stronger vocational capabilities, improved employability and better preparation for enterprise.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 1, 3, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:40:40', NULL),
(7, NULL, 1, 1, 'programmes', 'Livelihood Promotion and Economic Empowerment', 'livelihood-promotion-and-economic-empowerment', 'Support sustainable income opportunities through enterprise development, financial literacy and market-oriented initiatives.', 'Support sustainable income opportunities through enterprise development, financial literacy and market-oriented initiatives.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Livelihood Promotion & Economic Empowerment\n\nSupporting individuals and communities in developing sustainable sources of income.\nOur focus includes:\n•	Self-employment\n•	Micro-enterprise development\n•	Livelihood enhancement\n•	Financial literacy\n•	Financial inclusion\n•	Income-generation activities\n•	Market-oriented livelihood initiatives\n\nWho the programme is designed to support\nIndividuals and communities seeking self-employment and more secure sources of income.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Improved financial understanding, viable enterprise planning and stronger access to livelihood opportunities.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Livelihood Promotion & Economic Empowerment', '[\"Livelihood Promotion & Economic Empowerment\",\"SIFI Foundation\",\"Community-led development\"]', 'Livelihood Promotion and Economic Empowerment', 'Support sustainable income opportunities through enterprise development, financial literacy and market-oriented initiatives.', '/uploads/programmes/9c987757-2245-415b-8e76-245452b1ad9e.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Support sustainable income opportunities through enterprise development, financial literacy and market-oriented initiatives.\",\"objectives\":\"Support sustainable income opportunities through enterprise development, financial literacy and market-oriented initiatives.\",\"targetBeneficiaries\":\"Individuals and communities seeking self-employment and more secure sources of income.\",\"keyActivities\":\"Supporting individuals and communities in developing sustainable sources of income.\\nOur focus includes:\\n•\\tSelf-employment\\n•\\tMicro-enterprise development\\n•\\tLivelihood enhancement\\n•\\tFinancial literacy\\n•\\tFinancial inclusion\\n•\\tIncome-generation activities\\n•\\tMarket-oriented livelihood initiatives\",\"outcomes\":\"Intended outcomes: Improved financial understanding, viable enterprise planning and stronger access to livelihood opportunities.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 4, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:41:52', NULL),
(8, NULL, 1, 1, 'programmes', 'Women and Girl Empowerment', 'women-and-girl-empowerment', 'Connect education, health, skills, financial inclusion and leadership opportunities for women and girls.', 'Connect education, health, skills, financial inclusion and leadership opportunities for women and girls.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Women & Girl Empowerment\n\nSupporting women and girls to access education, healthcare, skills, livelihoods and leadership opportunities.\nOur focus includes:\n•	Education\n•	Healthcare\n•	Skill development\n•	Entrepreneurship\n•	Livelihood generation\n•	Financial inclusion\n•	Leadership development\n•	Awareness and protection\n•	Community-based empowerment\n\nWho the programme is designed to support\nWomen and girls, with attention to underserved and vulnerable communities.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Greater participation in education, enterprise and community decisions, supported by practical capabilities.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Women & Girl Empowerment', '[\"Women & Girl Empowerment\",\"SIFI Foundation\",\"Community-led development\"]', 'Women and Girl Empowerment', 'Connect education, health, skills, financial inclusion and leadership opportunities for women and girls.', '/uploads/programmes/1c2cfe9e-74e1-4796-8b10-386e5228f5a6.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Connect education, health, skills, financial inclusion and leadership opportunities for women and girls.\",\"objectives\":\"Connect education, health, skills, financial inclusion and leadership opportunities for women and girls.\",\"targetBeneficiaries\":\"Women and girls, with attention to underserved and vulnerable communities.\",\"keyActivities\":\"Supporting women and girls to access education, healthcare, skills, livelihoods and leadership opportunities.\\nOur focus includes:\\n•\\tEducation\\n•\\tHealthcare\\n•\\tSkill development\\n•\\tEntrepreneurship\\n•\\tLivelihood generation\\n•\\tFinancial inclusion\\n•\\tLeadership development\\n•\\tAwareness and protection\\n•\\tCommunity-based empowerment\",\"outcomes\":\"Intended outcomes: Greater participation in education, enterprise and community decisions, supported by practical capabilities.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 5, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:42:15', NULL),
(9, NULL, 1, 1, 'programmes', 'Sustainable Agriculture and Allied Livelihoods', 'sustainable-agriculture-and-allied-livelihoods', 'Bring climate-responsive farming together with livestock, dairy, fisheries and related rural livelihood support.', 'Bring climate-responsive farming together with livestock, dairy, fisheries and related rural livelihood support.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Agriculture & Sustainable Farming\n\nStrengthening farmers and rural communities through sustainable and climate-responsive agricultural practices.\nOur focus includes:\n•	Sustainable agriculture\n•	Organic farming\n•	Climate-resilient agriculture\n•	Farmer capacity building\n•	Agricultural technology\n•	Awareness and training\n•	Market linkages\n•	Value addition\n•	Farmer-oriented livelihood initiatives\nThe MOA specifically includes sustainable/organic and climate-resilient farming, agricultural technology, market linkage and value addition.\n\nAnimal Husbandry, Fisheries & Allied Livelihoods\n\nSupporting communities dependent on livestock, dairy, fisheries, aquaculture and related activities.\nOur focus includes:\n•	Livestock development\n•	Dairy activities\n•	Fisheries\n•	Aquaculture\n•	Technical assistance\n•	Capacity building\n•	Livelihood development\n\nWho the programme is designed to support\nFarmers and rural households dependent on agriculture, livestock, dairy, fisheries or aquaculture.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Stronger agricultural knowledge, responsible resource practices and improved readiness for market linkages and value addition.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Agriculture & Sustainable Farming', '[\"Agriculture & Sustainable Farming\",\"SIFI Foundation\",\"Community-led development\"]', 'Sustainable Agriculture and Allied Livelihoods', 'Bring climate-responsive farming together with livestock, dairy, fisheries and related rural livelihood support.', '/uploads/programmes/b437b6f8-8f0e-478f-985e-cf98bb36b862.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Bring climate-responsive farming together with livestock, dairy, fisheries and related rural livelihood support.\",\"objectives\":\"Bring climate-responsive farming together with livestock, dairy, fisheries and related rural livelihood support.\",\"targetBeneficiaries\":\"Farmers and rural households dependent on agriculture, livestock, dairy, fisheries or aquaculture.\",\"keyActivities\":\"Strengthening farmers and rural communities through sustainable and climate-responsive agricultural practices.\\nOur focus includes:\\n•\\tSustainable agriculture\\n•\\tOrganic farming\\n•\\tClimate-resilient agriculture\\n•\\tFarmer capacity building\\n•\\tAgricultural technology\\n•\\tAwareness and training\\n•\\tMarket linkages\\n•\\tValue addition\\n•\\tFarmer-oriented livelihood initiatives\\nThe MOA specifically includes sustainable/organic and climate-resilient farming, agricultural technology, market linkage and value addition.\\n\\nSupporting communities dependent on livestock, dairy, fisheries, aquaculture and related activities.\\nOur focus includes:\\n•\\tLivestock development\\n•\\tDairy activities\\n•\\tFisheries\\n•\\tAquaculture\\n•\\tTechnical assistance\\n•\\tCapacity building\\n•\\tLivelihood development\",\"outcomes\":\"Intended outcomes: Stronger agricultural knowledge, responsible resource practices and improved readiness for market linkages and value addition.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 6, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:43:34', NULL),
(10, NULL, 1, 1, 'programmes', 'Environment, Climate Action and Clean Energy', 'environment-climate-action-and-clean-energy', 'Connect biodiversity, climate awareness and resource conservation with practical renewable-energy learning.', 'Connect biodiversity, climate awareness and resource conservation with practical renewable-energy learning.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Environment, Biodiversity & Climate Action\n\nWorking towards healthier ecosystems and environmentally responsible communities.\nOur focus includes:\n•	Afforestation\n•	Plantation\n•	Biodiversity conservation\n•	Ecosystem protection\n•	Climate awareness\n•	Climate adaptation\n•	Pollution control\n•	Environmental education\n\nRenewable Energy & Clean Energy\n\nPromoting practical and sustainable energy solutions for communities.\nOur focus includes:\n•	Solar energy awareness\n•	Renewable energy\n•	Energy efficiency\n•	Clean technology\n•	Community-based demonstrations\n•	Capacity building\n•	Research and awareness\n\nWho the programme is designed to support\nCommunities seeking healthier ecosystems and accessible knowledge about sustainable energy.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Greater environmental awareness, stronger conservation participation and informed decisions about clean energy.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Environment, Biodiversity & Climate Action', '[\"Environment, Biodiversity & Climate Action\",\"SIFI Foundation\",\"Community-led development\"]', 'Environment, Climate Action and Clean Energy', 'Connect biodiversity, climate awareness and resource conservation with practical renewable-energy learning.', '/uploads/programmes/de90b57c-919b-4f23-9f29-22518d4c34e4.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Connect biodiversity, climate awareness and resource conservation with practical renewable-energy learning.\",\"objectives\":\"Connect biodiversity, climate awareness and resource conservation with practical renewable-energy learning.\",\"targetBeneficiaries\":\"Communities seeking healthier ecosystems and accessible knowledge about sustainable energy.\",\"keyActivities\":\"Working towards healthier ecosystems and environmentally responsible communities.\\nOur focus includes:\\n•\\tAfforestation\\n•\\tPlantation\\n•\\tBiodiversity conservation\\n•\\tEcosystem protection\\n•\\tClimate awareness\\n•\\tClimate adaptation\\n•\\tPollution control\\n•\\tEnvironmental education\\n\\nPromoting practical and sustainable energy solutions for communities.\\nOur focus includes:\\n•\\tSolar energy awareness\\n•\\tRenewable energy\\n•\\tEnergy efficiency\\n•\\tClean technology\\n•\\tCommunity-based demonstrations\\n•\\tCapacity building\\n•\\tResearch and awareness\",\"outcomes\":\"Intended outcomes: Greater environmental awareness, stronger conservation participation and informed decisions about clean energy.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 7, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:44:16', NULL),
(11, NULL, 1, 1, 'programmes', 'Water, Sanitation, Hygiene and Waste Management', 'water-sanitation-hygiene-and-waste-management', 'Promote safe water, conservation, hygiene and responsible waste practices as interconnected community priorities.', 'Promote safe water, conservation, hygiene and responsible waste practices as interconnected community priorities.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Water, Sanitation, Hygiene & Waste Management\n\nPromoting healthy communities through improved water, sanitation, hygiene and environmental practices.\nOur focus includes:\n•	Safe drinking water\n•	Water conservation\n•	Rainwater harvesting\n•	Sanitation\n•	Hygiene awareness\n•	Solid and liquid waste management\n•	Recycling\n•	Cleanliness initiatives\nThese areas are specifically included in the Foundation\'s objects.\n\nWho the programme is designed to support\nCommunities facing gaps in water access, sanitation, hygiene information or waste management.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Better understanding of water safety and conservation, cleaner shared spaces and responsible waste practices.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Water, Sanitation, Hygiene & Waste Management', '[\"Water, Sanitation, Hygiene & Waste Management\",\"SIFI Foundation\",\"Community-led development\"]', 'Water, Sanitation, Hygiene and Waste Management', 'Promote safe water, conservation, hygiene and responsible waste practices as interconnected community priorities.', '/uploads/programmes/c37b0fec-b49b-4f94-98ad-89d0b1e29015.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Promote safe water, conservation, hygiene and responsible waste practices as interconnected community priorities.\",\"objectives\":\"Promote safe water, conservation, hygiene and responsible waste practices as interconnected community priorities.\",\"targetBeneficiaries\":\"Communities facing gaps in water access, sanitation, hygiene information or waste management.\",\"keyActivities\":\"Promoting healthy communities through improved water, sanitation, hygiene and environmental practices.\\nOur focus includes:\\n•\\tSafe drinking water\\n•\\tWater conservation\\n•\\tRainwater harvesting\\n•\\tSanitation\\n•\\tHygiene awareness\\n•\\tSolid and liquid waste management\\n•\\tRecycling\\n•\\tCleanliness initiatives\\nThese areas are specifically included in the Foundation\'s objects.\",\"outcomes\":\"Intended outcomes: Better understanding of water safety and conservation, cleaner shared spaces and responsible waste practices.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 8, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:46:10', NULL);
INSERT INTO `contents` (`id`, `category_id`, `created_by`, `updated_by`, `module`, `title`, `slug`, `short_description`, `description`, `content`, `category`, `tags`, `meta_title`, `meta_description`, `featured_image`, `image1`, `image2`, `image3`, `image4`, `video_url`, `document_file`, `payload`, `status`, `featured`, `sort_order`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(12, NULL, 1, 1, 'programmes', 'Inclusive Community Development and Humanitarian Resilience', 'inclusive-community-development-and-humanitarian-resilience', 'Strengthen local institutions and essential services while supporting inclusion, culture and emergency resilience.', 'Strengthen local institutions and essential services while supporting inclusion, culture and emergency resilience.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Rural, Tribal & Community Development\n\nSupporting communities in improving access to essential services, opportunities and local development resources.\nOur focus includes:\n•	Community development\n•	Rural development\n•	Tribal development\n•	Community institutions\n•	Basic services\n•	Local capacity building\n•	Community infrastructure\n•	Participatory development\n\nChild Welfare\n\nPromoting opportunities for children through education, health, nutrition, protection, learning and community support initiatives.\n\nSenior Citizen Welfare\n\nSupporting dignity, wellbeing, social inclusion and access to essential services for senior citizens.\n\nPersons with Disabilities\n\nPromoting inclusion, accessibility, dignity, opportunities and community participation for persons with disabilities.\n\nDisaster Management & Humanitarian Response\n\nSupporting communities before, during and after emergencies through preparedness, relief, rehabilitation and recovery-oriented interventions.\n\nSports, Arts, Culture & Heritage\n\nPromoting physical wellbeing, creativity, culture, heritage, traditional knowledge and community participation.\n\nWho the programme is designed to support\nRural and tribal communities, children, senior citizens, persons with disabilities and people affected by emergencies.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: More inclusive community participation, stronger local capacity and better preparedness for disruptions.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Rural, Tribal & Community Development', '[\"Rural, Tribal & Community Development\",\"SIFI Foundation\",\"Community-led development\"]', 'Inclusive Community Development and Humanitarian Resilience', 'Strengthen local institutions and essential services while supporting inclusion, culture and emergency resilience.', '/uploads/programmes/ac122c3f-5cdd-413b-bb58-2671751d281d.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Strengthen local institutions and essential services while supporting inclusion, culture and emergency resilience.\",\"objectives\":\"Strengthen local institutions and essential services while supporting inclusion, culture and emergency resilience.\",\"targetBeneficiaries\":\"Rural and tribal communities, children, senior citizens, persons with disabilities and people affected by emergencies.\",\"keyActivities\":\"Supporting communities in improving access to essential services, opportunities and local development resources.\\nOur focus includes:\\n•\\tCommunity development\\n•\\tRural development\\n•\\tTribal development\\n•\\tCommunity institutions\\n•\\tBasic services\\n•\\tLocal capacity building\\n•\\tCommunity infrastructure\\n•\\tParticipatory development\\n\\nPromoting opportunities for children through education, health, nutrition, protection, learning and community support initiatives.\\n\\nSupporting dignity, wellbeing, social inclusion and access to essential services for senior citizens.\\n\\nPromoting inclusion, accessibility, dignity, opportunities and community participation for persons with disabilities.\\n\\nSupporting communities before, during and after emergencies through preparedness, relief, rehabilitation and recovery-oriented interventions.\\n\\nPromoting physical wellbeing, creativity, culture, heritage, traditional knowledge and community participation.\",\"outcomes\":\"Intended outcomes: More inclusive community participation, stronger local capacity and better preparedness for disruptions.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 9, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:48:32', NULL),
(13, NULL, 1, 1, 'programmes', 'Research, Baseline Studies and Social Impact Assessment', 'research-baseline-studies-and-social-impact-assessment', 'Generate reliable evidence to identify priorities, establish baselines and improve programme decisions.', 'Generate reliable evidence to identify priorities, establish baselines and improve programme decisions.\n\nThis programme area reflects SIFI Foundation’s commitment to inclusive, participatory and evidence-based development. Specific activities are shaped by community needs, local resources and appropriate partnerships.', 'Research, Baseline Studies & Social Impact Assessment\n\nEvidence for Better Decisions\nGood programmes begin with good information.\nSIFI Foundation undertakes research and evidence-generation activities to understand communities, identify needs, establish baselines and assess outcomes.\nOur capabilities include:\n•	Baseline studies\n•	Socio-economic surveys\n•	Needs assessments\n•	Community consultations\n•	Beneficiary assessments\n•	Monitoring & evaluation\n•	Social impact assessment\n•	Endline studies\n•	Documentation\n•	Case studies\n•	Impact reporting\nThe Foundation\'s MOA expressly provides for surveys, baseline studies, socio-economic studies, needs assessments, monitoring, evaluation and social impact assessments.\n\nWho the programme is designed to support\nCommunities and institutions participating in development planning, implementation and evaluation.\n\nFrom needs to implementation\nFrom Community Needs to Sustainable Solutions\nWe follow a structured approach to programme development and implementation.\n01 — Understand\nWe listen to communities and understand local needs, challenges, resources and aspirations.\n02 — Assess\nWe use field assessments, baseline studies, surveys and consultations to establish evidence.\n03 — Design\nWe develop practical, context-specific interventions with clear objectives and measurable indicators.\n04 — Partner\nWe collaborate with government institutions, corporates, CSR partners, NGOs, technical organisations, academic institutions and communities.\n05 — Implement\nWe deploy professional teams, systems and field processes for effective execution.\n06 — Monitor\nWe track activities, outputs, beneficiaries, quality and programme progress.\n07 — Evaluate\nWe assess outcomes, learn from implementation and identify areas for improvement.\n08 — Scale\nSuccessful and sustainable models can be strengthened, replicated or expanded.\n\nIntended outcomes and learning\nIntended outcomes: Clearer needs assessments, useful monitoring information and transparent documentation of outcomes and learning.\n\nAssessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.', 'Research, Baseline Studies & Social Impact Assessment', '[\"Research, Baseline Studies & Social Impact Assessment\",\"SIFI Foundation\",\"Community-led development\"]', 'Research, Baseline Studies and Social Impact Assessment', 'Generate reliable evidence to identify priorities, establish baselines and improve programme decisions.', '/uploads/programmes/ece02169-2c51-48e2-8f9d-33af5781a19f.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Generate reliable evidence to identify priorities, establish baselines and improve programme decisions.\",\"objectives\":\"Generate reliable evidence to identify priorities, establish baselines and improve programme decisions.\",\"targetBeneficiaries\":\"Communities and institutions participating in development planning, implementation and evaluation.\",\"keyActivities\":\"Evidence for Better Decisions\\nGood programmes begin with good information.\\nSIFI Foundation undertakes research and evidence-generation activities to understand communities, identify needs, establish baselines and assess outcomes.\\nOur capabilities include:\\n•\\tBaseline studies\\n•\\tSocio-economic surveys\\n•\\tNeeds assessments\\n•\\tCommunity consultations\\n•\\tBeneficiary assessments\\n•\\tMonitoring & evaluation\\n•\\tSocial impact assessment\\n•\\tEndline studies\\n•\\tDocumentation\\n•\\tCase studies\\n•\\tImpact reporting\\nThe Foundation\'s MOA expressly provides for surveys, baseline studies, socio-economic studies, needs assessments, monitoring, evaluation and social impact assessments.\",\"outcomes\":\"Intended outcomes: Clearer needs assessments, useful monitoring information and transparent documentation of outcomes and learning.\",\"impactSummary\":\"Assessment focuses on reach, access, outcomes, inclusion, sustainability and learning. Achieved results require verified programme records.\",\"contactEmail\":\"projects@sififoundation.org\",\"contactPhone\":\"0651-3591618\",\"websiteUrl\":\"https://www.sififoundation.org\",\"problemStatement\":\"Community consultations and baseline assessment identify local barriers before programme activities are designed.\"}', 'published', 0, 10, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:50:41', NULL),
(14, 3, 1, 1, 'blogs', 'Health, Learning and Opportunity: An Integrated Development Framework', 'health-learning-and-opportunity-an-integrated-development-framework', 'Explore how SIFI connects health, education, skills, livelihoods and sustainability across its areas of work.', 'Everyday development needs rarely arrive one at a time. Learning depends on wellbeing; livelihood opportunities depend on skills; and community resilience depends on the environment and essential services. SIFI Foundation brings these priorities into one connected framework while retaining the specialist attention each area needs.', 'Working Across Development Priorities\nOur programmes are designed around interconnected development needs. We combine sector-specific expertise with an integrated community-development approach.\n01 — Healthcare & Public Health\nImproving access to preventive, promotive and basic healthcare services for underserved communities.\nOur focus includes:\n•	Community healthcare\n•	Health camps and outreach\n•	Preventive healthcare\n•	Health awareness\n•	Nutrition awareness\n•	Maternal and community health\n•	Sanitation and hygiene\n•	Public health initiatives\n•	Healthcare facilities and support services\nThe Foundation’s constitutional objects specifically provide for charitable hospitals, healthcare centres, clinics, diagnostic centres, medical camps and preventive/public-health programmes.\n02 — Education & Digital Learning\nCreating pathways to learning, literacy and educational opportunity.\nOur focus includes:\n•	School education support\n•	Digital learning\n•	Literacy\n•	Libraries and learning centres\n•	Educational assistance\n•	Scholarships and study materials\n•	Digital education\n•	Learning support for disadvantaged communities\n\n03 — Skill Development, Employment & Entrepreneurship\nBuilding skills that connect people with employment, enterprise and economic opportunity.\nOur focus includes:\n•	Vocational training\n•	Technical training\n•	Employability enhancement\n•	Entrepreneurship development\n•	Youth skill development\n•	Women-focused skill programmes\n•	Capacity building\n•	Employment-oriented programmes\nThese areas are expressly included in the Foundation\'s objects, including vocational, technical, entrepreneurship and employment-oriented programmes.\n\n04 — Livelihood Promotion & Economic Empowerment\nSupporting individuals and communities in developing sustainable sources of income.\nOur focus includes:\n•	Self-employment\n•	Micro-enterprise development\n•	Livelihood enhancement\n•	Financial literacy\n•	Financial inclusion\n•	Income-generation activities\n•	Market-oriented livelihood initiatives\n\n05 — Women & Girl Empowerment\nSupporting women and girls to access education, healthcare, skills, livelihoods and leadership opportunities.\nOur focus includes:\n•	Education\n•	Healthcare\n•	Skill development\n•	Entrepreneurship\n•	Livelihood generation\n•	Financial inclusion\n•	Leadership development\n•	Awareness and protection\n•	Community-based empowerment\n\n06 — Agriculture & Sustainable Farming\nStrengthening farmers and rural communities through sustainable and climate-responsive agricultural practices.\nOur focus includes:\n•	Sustainable agriculture\n•	Organic farming\n•	Climate-resilient agriculture\n•	Farmer capacity building\n•	Agricultural technology\n•	Awareness and training\n•	Market linkages\n•	Value addition\n•	Farmer-oriented livelihood initiatives\nThe MOA specifically includes sustainable/organic and climate-resilient farming, agricultural technology, market linkage and value addition.\n\n07 — Animal Husbandry, Fisheries & Allied Livelihoods\nSupporting communities dependent on livestock, dairy, fisheries, aquaculture and related activities.\nOur focus includes:\n•	Livestock development\n•	Dairy activities\n•	Fisheries\n•	Aquaculture\n•	Technical assistance\n•	Capacity building\n•	Livelihood development\n08 — Environment, Biodiversity & Climate Action\nWorking towards healthier ecosystems and environmentally responsible communities.\nOur focus includes:\n•	Afforestation\n•	Plantation\n•	Biodiversity conservation\n•	Ecosystem protection\n•	Climate awareness\n•	Climate adaptation\n•	Pollution control\n•	Environmental education\n09 — Renewable Energy & Clean Energy\nPromoting practical and sustainable energy solutions for communities.\nOur focus includes:\n•	Solar energy awareness\n•	Renewable energy\n•	Energy efficiency\n•	Clean technology\n•	Community-based demonstrations\n•	Capacity building\n•	Research and awareness\n10 — Water, Sanitation, Hygiene & Waste Management\nPromoting healthy communities through improved water, sanitation, hygiene and environmental practices.\nOur focus includes:\n•	Safe drinking water\n•	Water conservation\n•	Rainwater harvesting\n•	Sanitation\n•	Hygiene awareness\n•	Solid and liquid waste management\n•	Recycling\n•	Cleanliness initiatives\nThese areas are specifically included in the Foundation\'s objects.\n11 — Rural, Tribal & Community Development\nSupporting communities in improving access to essential services, opportunities and local development resources.\nOur focus includes:\n•	Community development\n•	Rural development\n•	Tribal development\n•	Community institutions\n•	Basic services\n•	Local capacity building\n•	Community infrastructure\n•	Participatory development\n12 — Research, Baseline Studies & Social Impact Assessment\nEvidence for Better Decisions\nGood programmes begin with good information.\nSIFI Foundation undertakes research and evidence-generation activities to understand communities, identify needs, establish baselines and assess outcomes.\nOur capabilities include:\n•	Baseline studies\n•	Socio-economic surveys\n•	Needs assessments\n•	Community consultations\n•	Beneficiary assessments\n•	Monitoring & evaluation\n•	Social impact assessment\n•	Endline studies\n•	Documentation\n•	Case studies\n•	Impact reporting\nThe Foundation\'s MOA expressly provides for surveys, baseline studies, socio-economic studies, needs assessments, monitoring, evaluation and social impact assessments.\n13 — Child Welfare\nPromoting opportunities for children through education, health, nutrition, protection, learning and community support initiatives.\n14 — Senior Citizen Welfare\nSupporting dignity, wellbeing, social inclusion and access to essential services for senior citizens.\n15 — Persons with Disabilities\nPromoting inclusion, accessibility, dignity, opportunities and community participation for persons with disabilities.\n16 — Disaster Management & Humanitarian Response\nSupporting communities before, during and after emergencies through preparedness, relief, rehabilitation and recovery-oriented interventions.\n17 — Technology & Digital Inclusion\nUsing technology to improve access to education, healthcare, skills, information, research and community services.\nThe Foundation\'s objects permit development of websites, mobile applications, digital platforms, online learning systems and databases for charitable purposes.\n18 — Sports, Arts, Culture & Heritage\nPromoting physical wellbeing, creativity, culture, heritage, traditional knowledge and community participation.\n\nHEALTH • LEARN • SKILL • EARN • EMPOWER • SUSTAIN • RESEARCH • PARTNER\nHEALTH\nAccessible healthcare and stronger public-health systems.\nLEARN\nEducation, literacy and digital learning opportunities.\nSKILL\nSkills for employment, enterprise and economic participation.\nEARN\nSustainable livelihoods and economic empowerment.\nEMPOWER\nOpportunities for women, youth and vulnerable communities.\nSUSTAIN\nEnvironment, climate action and sustainable resource management.\nRESEARCH\nEvidence, data and knowledge for better development decisions.\nPARTNER\nCollaborative action with institutions, CSR partners and communities.\n\nWhere Development Meets Action\nHealthcare\nTaking essential health services and awareness closer to communities.\nEducation\nCreating pathways to learning, literacy and digital access.\nLivelihoods\nBuilding skills, enterprise and sustainable economic opportunities.\nEmpowerment\nStrengthening the participation and capabilities of women, youth and vulnerable groups.\nSustainability\nPromoting responsible approaches to agriculture, environment, water and energy.\nResearch\nGenerating evidence that helps programmes become more relevant and measurable.', 'Development Priorities', '[\"Development Priorities\",\"SIFI Foundation\",\"Community-led development\"]', 'Health, Learning and Opportunity: An Integrated Development Framework', 'Explore how SIFI connects health, education, skills, livelihoods and sustainability across its areas of work.', '/uploads/blogs/f5cb73d6-695c-406c-aa8a-107a4a773311.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 1, 2, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:54:34', NULL),
(15, 4, 1, 1, 'blogs', 'Partnerships That Begin with Community Priorities', 'partnerships-that-begin-with-community-priorities', 'A shared approach to CSR, institutional collaboration and responsible programme implementation.', 'A meaningful partnership starts by agreeing on the problem to solve. Community knowledge helps identify priorities, institutional resources make action possible, and professional implementation connects intentions to accountable delivery. SIFI Foundation’s partnership model brings these contributions together around locally relevant objectives.', 'Turning CSR Commitments into Measurable Community Impact\nSIFI Foundation works with corporates and institutions to design and implement responsible social-development programmes aligned with community needs and organisational priorities.\nOur CSR Support Areas\n•	Community needs assessment\n•	Baseline studies\n•	CSR programme design\n•	Project implementation\n•	Healthcare programmes\n•	Education initiatives\n•	Skill development\n•	Livelihood programmes\n•	Women empowerment\n•	Environmental initiatives\n•	Water and sanitation\n•	Community development\n•	Monitoring & evaluation\n•	Impact assessment\n•	Documentation and reporting\nThe Foundation\'s MOA specifically enables it to undertake CSR/ESG projects and act as an implementing agency wherever legally permissible and in accordance with applicable law.\nOur Partnership Philosophy\nCorporate Resources + Community Knowledge + Professional Implementation + Evidence = Sustainable Impact\nWe aim to create partnerships that go beyond short-term activities and contribute to measurable, responsible and sustainable development outcomes.\n\nCollaboration for Greater Impact\nSustainable development requires collaboration.\nWe seek partnerships with:\n•	Government departments\n•	Public sector organisations\n•	Corporate houses\n•	CSR foundations\n•	NGOs and community organisations\n•	Academic institutions\n•	Research organisations\n•	Technical experts\n•	Development agencies\n•	Local communities\nThe Foundation\'s constitutional objects specifically provide for collaborations and lawful arrangements with governments, educational institutions, universities, research institutions, corporates, NGOs, trusts, foundations and development agencies.\n\nTogether, We Can Build Stronger Communities\nMeaningful change begins when people, institutions and ideas come together.\nSIFI Foundation invites organisations, professionals, communities and development partners to collaborate in building solutions that are inclusive, evidence-based and sustainable.', 'Partnerships', '[\"Partnerships\",\"SIFI Foundation\",\"Community-led development\"]', 'Partnerships That Begin with Community Priorities', 'A shared approach to CSR, institutional collaboration and responsible programme implementation.', '/uploads/blogs/00bd2d46-d61a-480c-a1bb-685fc1403d54.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 1, 3, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:56:02', NULL),
(16, 5, 1, 1, 'blogs', 'Measuring What Matters: Evidence, Learning and Accountability', 'measuring-what-matters-evidence-learning-and-accountability', 'Why baselines, community feedback and transparent reporting matter when assessing development outcomes.', 'An activity report can show what happened, but it cannot by itself explain what changed. SIFI Foundation’s approach to evidence connects initial needs, implementation quality and outcomes. It asks whether access improved, whether underserved groups participated and whether benefits can continue beyond a project period.', 'Evidence. Insight. Action.\nSIFI Foundation believes that effective development interventions must be informed by reliable evidence.\nOur research and knowledge initiatives help institutions understand communities, identify priorities, design interventions and measure change.\nResearch Services\nBaseline Studies\nEstablishing the socio-economic and development profile before programme implementation.\nSocio-Economic Surveys\nGenerating structured information on households, livelihoods, access to services and community conditions.\nNeeds Assessment\nIdentifying priority gaps and development needs through field-based assessment.\nSocial Impact Assessment\nUnderstanding the social effects of projects, programmes and interventions.\nMonitoring & Evaluation\nTracking progress, outcomes, quality and programme effectiveness.\nDocumentation & Knowledge Management\nConverting field experience and evidence into reports, case studies, learning documents and knowledge products.\nThe Foundation\'s MOA also provides for publication and dissemination of reports, research papers, training materials and digital content.\n\nMeasuring What Matters\nWe believe impact should be understood through more than the number of activities completed.\nOur programme monitoring focuses on:\nREACH\nHow many people and communities were reached?\nACCESS\nDid people gain access to services, information or opportunities?\nOUTCOME\nWhat changed as a result of the intervention?\nINCLUSION\nDid the programme reach underserved and vulnerable groups?\nSUSTAINABILITY\nCan the benefits continue beyond the project period?\nLEARNING\nWhat did the programme teach us and how can it be improved?\n\nImpact stories are planned around livelihoods, healthcare, education, women’s leadership and sustainability. Verified field documentation is needed before presenting these themes as individual beneficiary achievements.\n\nResponsible. Transparent. Accountable.\nTrust is built through responsible governance and transparent practices.\nSIFI Foundation is committed to:\n•	Responsible use of organisational resources\n•	Compliance with applicable laws and regulations\n•	Transparent programme management\n•	Proper financial management\n•	Monitoring and evaluation\n•	Documentation and reporting\n•	Responsible CSR implementation\n•	Institutional accountability\nResources\nThe website may provide access to:\n•	Annual Reports\n•	Financial Statements\n•	Statutory Documents\n•	Programme Reports\n•	CSR Reports\n•	Policies\n•	Impact Reports\n•	Research Publications\n•	Governance Information', 'Research and Impact', '[\"Research and Impact\",\"SIFI Foundation\",\"Community-led development\"]', 'Measuring What Matters: Evidence, Learning and Accountability', 'Why baselines, community feedback and transparent reporting matter when assessing development outcomes.', '/uploads/blogs/314c40f6-c859-4476-b80d-7929a7411a46.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 0, 4, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:58:03', NULL),
(17, 6, 1, 1, 'blogs', 'Local Solutions, Lasting Change: Building Community Institutions', 'local-solutions-lasting-change-building-community-institutions', 'Learning centres, local capacity and inclusive institutions can strengthen community ownership of development.', 'A community centre can be more than a building. It can become a place to learn, share information and discuss common priorities when the people who use it have a voice in its purpose. SIFI Foundation’s community-development model places participation and local capacity at the centre of these shared resources.', 'Local Solutions. Lasting Change.\nCommunities understand their own challenges best.\nOur community-development model therefore encourages participation, local ownership and capacity building.\nWe support initiatives such as:\n•	Community centres\n•	Learning centres\n•	Libraries\n•	Digital learning centres\n•	Healthcare facilities\n•	Community resource centres\n•	Agricultural information centres\n•	Awareness programmes\n•	Local capacity building\n•	Community institutions\nOur objective is to strengthen the ability of communities to identify priorities, access opportunities and participate in their own development.\n\nMULTI-SECTOR DEVELOPMENT\nHealthcare • Education • Livelihoods • Environment\nEVIDENCE-BASED APPROACH\nResearch • Baseline • M&E • Impact Assessment\nCOLLABORATIVE DEVELOPMENT\nGovernment • CSR • Institutions • Communities\nCOMMUNITY-CENTRIC ACTION\nLocal Needs • Local Participation • Sustainable Solutions', 'Community Institutions', '[\"Community Institutions\",\"SIFI Foundation\",\"Community-led development\"]', 'Local Solutions, Lasting Change: Building Community Institutions', 'Learning centres, local capacity and inclusive institutions can strengthen community ownership of development.', '/uploads/blogs/2b33b810-6078-4b18-8e6a-e40cf51dcdcf.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 0, 5, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 18:59:54', NULL),
(18, 7, 1, 1, 'blogs', 'Purpose, People and the Journey of SIFI Foundation', 'purpose-people-and-the-journey-of-sifi-foundation', 'An introduction to the Foundation’s institutional journey, leadership and commitment to sustainable development.', 'Institutional development gives a social purpose the structures it needs to grow responsibly. SIFI Foundation describes its journey as a move from field-oriented understanding towards a broader platform for programmes, research and partnerships. Its leadership message connects this growth with dignity, capability and meaningful community participation.', 'Leadership & Governance\nMithilesh Pratap Singh\nManaging Director / Director\nLeading the organisation with a focus on strategic direction, institutional development, partnerships and impact-oriented implementation.\nMadhu Priya Soni\nDirector\nSupporting organisational governance, institutional development and programme direction.\nKunal Singh Rana\nDirector\nContributing to organisational development, programme implementation and strategic growth.\n\nA Commitment to Purpose, Partnership and Impact\nIndia\'s development journey is creating new opportunities, but significant challenges continue to exist across healthcare, education, livelihoods, skills, gender equality, environmental sustainability and access to essential services.\nSIFI Foundation has been established with a clear purpose—to contribute to this journey by working closely with communities and institutions to create practical, inclusive and sustainable solutions.\nWe believe that development is not simply about delivering services. It is about creating capabilities, strengthening systems, enabling opportunities and ensuring that people are able to participate meaningfully in their own progress.\nSIFI Foundation carries forward a field-oriented approach while building a stronger institutional framework for professional programme management, research, partnerships and measurable social impact.\nOur work will bring together community knowledge, professional expertise, technology and institutional partnerships across areas such as healthcare, education, skills, livelihoods, women and youth empowerment, agriculture, environment, digital inclusion and research.\nWe believe that every community has potential. Our responsibility is to help create the conditions in which that potential can flourish.\nWe therefore welcome partnerships with government institutions, corporates, CSR organisations, development agencies, academic institutions, NGOs, professionals and communities who share our commitment to inclusive and sustainable development.\nTogether, we can transform needs into opportunities and opportunities into lasting impact.\nMithilesh Pratap Singh\nManaging Director\nSocial Initiative for India Foundation\n\nFrom Social Initiative to a Stronger Institutional Platform\nSIFI Foundation represents the institutional expansion of a field-oriented social-development vision.\nThe Foundation is designed to create a broader platform through which community development programmes, healthcare initiatives, education and skill programmes, livelihood interventions, research, CSR partnerships and sustainable-development initiatives can be professionally planned and implemented.\nOur Journey Model\nCommunity Understanding\n↓\nField Experience\n↓\nInstitutional Development\n↓\nStrategic Partnerships\n↓\nEvidence-Based Programmes\n↓\nMeasurable Social Impact', 'Foundation Updates', '[\"Foundation Updates\",\"SIFI Foundation\",\"Community-led development\"]', 'Purpose, People and the Journey of SIFI Foundation', 'An introduction to the Foundation’s institutional journey, leadership and commitment to sustainable development.', '/uploads/blogs/091dc0cd-ed06-4312-809e-24dca71660e4.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 0, 6, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:01:40', NULL),
(19, 8, 1, 1, 'blogs', 'Be Part of the Change: Ways to Work with SIFI Foundation', 'be-part-of-the-change-ways-to-work-with-sifi-foundation', 'Discover ways to contribute expertise, volunteer, support programmes and start a conversation with SIFI.', 'People contribute to development in different ways. Some bring technical knowledge, some build institutional partnerships, and others share time or field experience. A useful first step is to connect that contribution with an identified community need and a clear role in the Foundation’s work.', 'Be Part of the Change\nThere are many ways to contribute to meaningful development.\nPartner\nCollaborate with us on CSR, development and community programmes.\nSupport\nSupport programmes that improve healthcare, education, livelihoods and community wellbeing.\nVolunteer\nShare your time, knowledge, professional expertise or field experience.\nCollaborate\nWork with us through research, technology, training, implementation or institutional partnerships.\nContribute Expertise\nProfessionals and technical experts can contribute knowledge in healthcare, education, agriculture, environment, research, technology and other development areas.\n\nLet\'s Work Together\nWhether you are a corporate organisation, government institution, development agency, NGO, researcher, professional, volunteer or community representative, we welcome conversations around meaningful collaboration.\nRegistered Office\nSocial Initiative for India Foundation\nC/22, Patel Park,\nHarmu Housing Colony,\nRanchi – 834002, Jharkhand, India\nEmail\ninfo@sififoundation.org\nprojects@sififoundation.org\nTelephone\n0651-3591618\nWebsite\nwww.sififoundation.org\n\nSOCIAL INITIATIVE FOR INDIA FOUNDATION\nCreating Opportunities. Strengthening Communities. Transforming Lives.\nHealthcare | Education | Skills | Livelihoods | Women Empowerment | Agriculture | Environment | Research | CSR | Community Development\nQuick Links\nHome\nAbout Us\nOur Journey\nAreas of Work\nOur Approach\nCSR & Partnerships\nResearch & Knowledge\nImpact\nLeadership\nResources\nGet Involved\nContact Us\nLegal\nPrivacy Policy\nTerms of Use\nDisclaimer\nTransparency\nStatutory Information\n© Social Initiative for India Foundation. All Rights Reserved.\nA Section 8 Not-for-Profit Organisation', 'Get Involved', '[\"Get Involved\",\"SIFI Foundation\",\"Community-led development\"]', 'Be Part of the Change: Ways to Work with SIFI Foundation', 'Discover ways to contribute expertise, volunteer, support programmes and start a conversation with SIFI.', '/uploads/blogs/2a58decf-518f-4c0b-a1c2-1396443ff034.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"overview\":\"Adapted from the SIFI Foundation organisational profile.\"}', 'published', 0, 7, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:03:22', NULL),
(20, NULL, 1, 1, 'impact_stories', 'From Need to Opportunity', 'from-need-to-opportunity', 'Impact pathway: Skills and enterprise support can create a pathway towards more secure livelihoods.', 'This is a programme-based impact pathway drawn from the Foundation’s profile, not a verified individual beneficiary case study.', 'A livelihood challenge is often a combination of limited training, uncertain market access and low financial confidence. Listening to these connected barriers is the starting point for useful support.\n\nVocational learning, entrepreneurship development and financial literacy can be brought together around locally relevant opportunities.\n\nThe pathway moves from understanding existing capabilities to developing skills, exploring viable enterprise options and reviewing whether support improves access to income opportunities.\n\nEvidence for a future field story would include a documented starting point, the support provided, participant consent and verified outcomes. The Foundation’s impact framework asks what changed, who could participate and whether benefits can continue.', 'Impact Pathways', '[\"Impact Pathways\",\"SIFI Foundation\",\"Community-led development\"]', 'From Need to Opportunity', 'Impact pathway: Skills and enterprise support can create a pathway towards more secure livelihoods.', '/uploads/impact_stories/d3252c48-76a7-4f85-af4a-3b5c68384fd0.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"background\":\"A livelihood challenge is often a combination of limited training, uncertain market access and low financial confidence. Listening to these connected barriers is the starting point for useful support.\",\"challenge\":\"A livelihood challenge is often a combination of limited training, uncertain market access and low financial confidence. Listening to these connected barriers is the starting point for useful support.\",\"intervention\":\"Vocational learning, entrepreneurship development and financial literacy can be brought together around locally relevant opportunities.\",\"supportProvided\":\"Programme focus: Livelihood Promotion and Economic Empowerment\",\"journey\":\"The pathway moves from understanding existing capabilities to developing skills, exploring viable enterprise options and reviewing whether support improves access to income opportunities.\",\"impact\":\"Intended change: Skills and enterprise support can create a pathway towards more secure livelihoods.\",\"result\":\"Verified beneficiary results are not supplied in the organisational profile.\",\"programmeId\":7}', 'published', 1, 1, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:08:45', NULL),
(21, NULL, 1, 1, 'impact_stories', 'A Healthier Community', 'a-healthier-community', 'Impact pathway: Community outreach and preventive care can help bring essential health information and support closer to people.', 'This is a programme-based impact pathway drawn from the Foundation’s profile, not a verified individual beneficiary case study.', 'When health information and basic services are difficult to access, families can struggle to identify available support. Community priorities help shape the response.\n\nHealth outreach, preventive awareness, nutrition information and maternal and community-health support form part of the Foundation’s healthcare focus.\n\nA responsible account follows the journey from an identified access barrier through outreach and support, then examines whether people could use the information or services offered.\n\nEvidence for a future field story would include a documented starting point, the support provided, participant consent and verified outcomes. The Foundation’s impact framework asks what changed, who could participate and whether benefits can continue.', 'Impact Pathways', '[\"Impact Pathways\",\"SIFI Foundation\",\"Community-led development\"]', 'A Healthier Community', 'Impact pathway: Community outreach and preventive care can help bring essential health information and support closer to people.', '/uploads/impact_stories/9bd358c5-7b24-43ec-a064-aa3d908bb9ca.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"background\":\"When health information and basic services are difficult to access, families can struggle to identify available support. Community priorities help shape the response.\",\"challenge\":\"When health information and basic services are difficult to access, families can struggle to identify available support. Community priorities help shape the response.\",\"intervention\":\"Health outreach, preventive awareness, nutrition information and maternal and community-health support form part of the Foundation’s healthcare focus.\",\"supportProvided\":\"Programme focus: Healthcare and Public Health\",\"journey\":\"A responsible account follows the journey from an identified access barrier through outreach and support, then examines whether people could use the information or services offered.\",\"impact\":\"Intended change: Community outreach and preventive care can help bring essential health information and support closer to people.\",\"result\":\"Verified beneficiary results are not supplied in the organisational profile.\",\"programmeId\":5}', 'published', 1, 2, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:10:19', NULL),
(22, NULL, 1, 1, 'impact_stories', 'Learning Beyond the Classroom', 'learning-beyond-the-classroom', 'Impact pathway: Education support and digital learning can open more accessible routes to knowledge and confidence.', 'This is a programme-based impact pathway drawn from the Foundation’s profile, not a verified individual beneficiary case study.', 'Learning opportunities depend on access to materials, supportive spaces and the ability to use available technology. Disadvantaged learners may face several of these barriers together.\n\nLibraries, learning centres, study materials, literacy initiatives and digital education offer complementary ways to support participation.\n\nThe learning pathway starts with the learner’s needs, connects them to relevant resources and reviews participation and learning progress without assuming that access alone guarantees achievement.\n\nEvidence for a future field story would include a documented starting point, the support provided, participant consent and verified outcomes. The Foundation’s impact framework asks what changed, who could participate and whether benefits can continue.', 'Impact Pathways', '[\"Impact Pathways\",\"SIFI Foundation\",\"Community-led development\"]', 'Learning Beyond the Classroom', 'Impact pathway: Education support and digital learning can open more accessible routes to knowledge and confidence.', '/uploads/impact_stories/dc931fef-4656-4f11-8902-ed0c50bf8dc2.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"background\":\"Learning opportunities depend on access to materials, supportive spaces and the ability to use available technology. Disadvantaged learners may face several of these barriers together.\",\"challenge\":\"Learning opportunities depend on access to materials, supportive spaces and the ability to use available technology. Disadvantaged learners may face several of these barriers together.\",\"intervention\":\"Libraries, learning centres, study materials, literacy initiatives and digital education offer complementary ways to support participation.\",\"supportProvided\":\"Programme focus: Education and Digital Learning\",\"journey\":\"The learning pathway starts with the learner’s needs, connects them to relevant resources and reviews participation and learning progress without assuming that access alone guarantees achievement.\",\"impact\":\"Intended change: Education support and digital learning can open more accessible routes to knowledge and confidence.\",\"result\":\"Verified beneficiary results are not supplied in the organisational profile.\",\"programmeId\":1}', 'published', 1, 3, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:12:13', NULL),
(23, NULL, 1, 1, 'impact_stories', 'Sustainable Communities', 'sustainable-communities', 'Impact pathway: Local participation can connect environmental responsibility, water conservation and resilient livelihoods.', 'This is a programme-based impact pathway drawn from the Foundation’s profile, not a verified individual beneficiary case study.', 'Environmental pressures intersect with agriculture, water use, energy and everyday community wellbeing. Practical responses need to reflect local ecosystems and resources.\n\nEnvironmental education, biodiversity conservation, climate awareness, sustainable farming and water conservation provide connected entry points for community action.\n\nCommunities can begin by identifying shared resource concerns, selecting appropriate practices and reviewing whether those practices are maintained and useful over time.\n\nEvidence for a future field story would include a documented starting point, the support provided, participant consent and verified outcomes. The Foundation’s impact framework asks what changed, who could participate and whether benefits can continue.', 'Impact Pathways', '[\"Impact Pathways\",\"SIFI Foundation\",\"Community-led development\"]', 'Sustainable Communities', 'Impact pathway: Local participation can connect environmental responsibility, water conservation and resilient livelihoods.', '/uploads/impact_stories/88b435b5-6b1f-4333-b03b-679dd0f4d8d2.png', NULL, NULL, NULL, NULL, NULL, NULL, '{\"background\":\"Environmental pressures intersect with agriculture, water use, energy and everyday community wellbeing. Practical responses need to reflect local ecosystems and resources.\",\"challenge\":\"Environmental pressures intersect with agriculture, water use, energy and everyday community wellbeing. Practical responses need to reflect local ecosystems and resources.\",\"intervention\":\"Environmental education, biodiversity conservation, climate awareness, sustainable farming and water conservation provide connected entry points for community action.\",\"supportProvided\":\"Programme focus: Environment, Climate Action and Clean Energy\",\"journey\":\"Communities can begin by identifying shared resource concerns, selecting appropriate practices and reviewing whether those practices are maintained and useful over time.\",\"impact\":\"Intended change: Local participation can connect environmental responsibility, water conservation and resilient livelihoods.\",\"result\":\"Verified beneficiary results are not supplied in the organisational profile.\",\"programmeId\":10}', 'published', 0, 5, '2026-09-17 18:30:35', '2026-09-17 18:30:35', '2026-09-17 19:14:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `transaction_uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `donation_number` varchar(10) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `donor_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `pan_number` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `anonymous_donation` tinyint(1) DEFAULT 0,
  `gateway` varchar(255) DEFAULT 'razorpay',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `status` enum('created','pending','authorized','captured','failed','refunded','cancelled') DEFAULT 'created',
  `payment_method` varchar(255) DEFAULT NULL,
  `failure_reason` text DEFAULT NULL,
  `receipt_number` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `gateway_id` int(11) DEFAULT NULL,
  `gateway_order_id` varchar(255) DEFAULT NULL,
  `gateway_payment_id` varchar(255) DEFAULT NULL,
  `gateway_credentials` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_gateways`
--

CREATE TABLE `payment_gateways` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `mode` varchar(255) NOT NULL DEFAULT 'test',
  `public_key` varchar(255) NOT NULL,
  `secret_key` text NOT NULL,
  `active_slot` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `slug`, `module`, `action`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'users view', 'users.view', 'users', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(2, 'users create', 'users.create', 'users', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(3, 'users edit', 'users.edit', 'users', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(4, 'users delete', 'users.delete', 'users', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(5, 'users status', 'users.status', 'users', 'status', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(6, 'users permissions', 'users.permissions', 'users', 'permissions', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(7, 'roles view', 'roles.view', 'roles', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(8, 'roles create', 'roles.create', 'roles', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(9, 'roles edit', 'roles.edit', 'roles', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(10, 'roles delete', 'roles.delete', 'roles', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(11, 'permissions view', 'permissions.view', 'permissions', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(12, 'permissions create', 'permissions.create', 'permissions', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(13, 'permissions edit', 'permissions.edit', 'permissions', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(14, 'permissions delete', 'permissions.delete', 'permissions', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(15, 'gallery view', 'gallery.view', 'gallery', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(16, 'gallery create', 'gallery.create', 'gallery', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(17, 'gallery edit', 'gallery.edit', 'gallery', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(18, 'gallery delete', 'gallery.delete', 'gallery', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(19, 'gallery publish', 'gallery.publish', 'gallery', 'publish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(20, 'gallery unpublish', 'gallery.unpublish', 'gallery', 'unpublish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(21, 'programmes view', 'programmes.view', 'programmes', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(22, 'programmes create', 'programmes.create', 'programmes', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(23, 'programmes edit', 'programmes.edit', 'programmes', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(24, 'programmes delete', 'programmes.delete', 'programmes', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(25, 'programmes publish', 'programmes.publish', 'programmes', 'publish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(26, 'programmes unpublish', 'programmes.unpublish', 'programmes', 'unpublish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(27, 'impact stories view', 'impact_stories.view', 'impact_stories', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(28, 'impact stories create', 'impact_stories.create', 'impact_stories', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(29, 'impact stories edit', 'impact_stories.edit', 'impact_stories', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(30, 'impact stories delete', 'impact_stories.delete', 'impact_stories', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(31, 'impact stories publish', 'impact_stories.publish', 'impact_stories', 'publish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(32, 'impact stories unpublish', 'impact_stories.unpublish', 'impact_stories', 'unpublish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(33, 'blogs view', 'blogs.view', 'blogs', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(34, 'blogs create', 'blogs.create', 'blogs', 'create', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(35, 'blogs edit', 'blogs.edit', 'blogs', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(36, 'blogs delete', 'blogs.delete', 'blogs', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(37, 'blogs publish', 'blogs.publish', 'blogs', 'publish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(38, 'blogs unpublish', 'blogs.unpublish', 'blogs', 'unpublish', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(39, 'settings view', 'settings.view', 'settings', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(40, 'settings edit', 'settings.edit', 'settings', 'edit', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(41, 'contact messages view', 'contact_messages.view', 'contact_messages', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(42, 'contact messages read', 'contact_messages.read', 'contact_messages', 'read', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(43, 'contact messages archive', 'contact_messages.archive', 'contact_messages', 'archive', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(44, 'contact messages delete', 'contact_messages.delete', 'contact_messages', 'delete', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(45, 'donations view', 'donations.view', 'donations', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(46, 'donations details', 'donations.details', 'donations', 'details', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(47, 'donations invoice', 'donations.invoice', 'donations', 'invoice', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(48, 'donations export', 'donations.export', 'donations', 'export', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(49, 'transactions view', 'transactions.view', 'transactions', 'view', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(50, 'transactions details', 'transactions.details', 'transactions', 'details', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(51, 'transactions export', 'transactions.export', 'transactions', 'export', NULL, 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Admin', 'super-admin', 'Super Admin role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(2, 'Admin', 'admin', 'Admin role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(3, 'Manager', 'manager', 'Manager role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(4, 'Staff', 'staff', 'Staff role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(5, 'User', 'user', 'User role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(6, 'Donor', 'donor', 'Donor role', 'active', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(1, 50),
(1, 51);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20260916170000-create-core-schema.cjs'),
('20260917140000-payment-gateways.cjs');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `group` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(255) DEFAULT 'text',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `group`, `key`, `value`, `type`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'general', 'website_name', 'Social Initiative for India Foundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(2, 'general', 'website_title', 'SIFI Foundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(3, 'general', 'tagline', 'Health | Learn | Skill | Earn', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(4, 'general', 'copyright_text', 'Social Initiative for India Foundation. All Rights Reserved.', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(5, 'header', 'header_phone', '0651-3591618', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(6, 'header', 'header_email', 'info@sififoundation.org', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(7, 'footer', 'footer_content', 'Creating opportunities and strengthening communities.', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(8, 'contact', 'primary_email', 'info@sififoundation.org', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(9, 'contact', 'phone', '0651-3591618', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(10, 'contact', 'address', 'C/22, Patel Park, Harmu Housing Colony, Ranchi - 834002, Jharkhand, India', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(11, 'social', 'facebook', 'https://www.facebook.com/sififoundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(12, 'social', 'instagram', 'https://www.instagram.com/sififoundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(13, 'social', 'linkedin', 'https://www.linkedin.com/company/sifi-foundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL),
(14, 'social', 'youtube', 'https://www.youtube.com/@sififoundation', 'text', '2026-09-16 18:03:13', '2026-09-16 18:03:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `alternate_phone` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `email_verified_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token_hash` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `phone`, `alternate_phone`, `profile_photo`, `cover_photo`, `date_of_birth`, `gender`, `address`, `city`, `state`, `country`, `pincode`, `designation`, `status`, `email_verified_at`, `last_login_at`, `password`, `reset_token_hash`, `reset_token_expires_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Super Admin', 'admin@sififoundation.org', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-09-16 18:03:13', '2026-09-17 19:41:18', '$2a$12$3/COp.0HKIdvb36DGvypf.1f0O439HUWM5pm6p1jAMlVCy5a8ncxe', NULL, NULL, '2026-09-16 18:03:13', '2026-09-17 19:41:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contents_module_slug` (`module`,`slug`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_uuid` (`transaction_uuid`),
  ADD UNIQUE KEY `donation_number` (`donation_number`),
  ADD UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`),
  ADD UNIQUE KEY `razorpay_payment_id` (`razorpay_payment_id`),
  ADD UNIQUE KEY `gateway_order_id` (`gateway_order_id`),
  ADD UNIQUE KEY `gateway_payment_id` (`gateway_payment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `donations_gateway_id_foreign_idx` (`gateway_id`);

--
-- Indexes for table `payment_gateways`
--
ALTER TABLE `payment_gateways`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `active_slot` (`active_slot`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_group_key` (`group`,`key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`user_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_gateways`
--
ALTER TABLE `payment_gateways`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `contents_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_gateway_id_foreign_idx` FOREIGN KEY (`gateway_id`) REFERENCES `payment_gateways` (`id`),
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
