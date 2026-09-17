-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 10:46 AM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Field Notes', 'field-notes', 'Updates from the ground', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `category_id`, `created_by`, `updated_by`, `module`, `title`, `slug`, `short_description`, `description`, `content`, `category`, `tags`, `meta_title`, `meta_description`, `featured_image`, `image1`, `image2`, `image3`, `image4`, `video_url`, `document_file`, `payload`, `status`, `featured`, `sort_order`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 1, 1, 'programmes', 'Education and Digital Learning', 'education-and-digital-learning', 'Learning support and digital access for children and young people.', 'Community learning programmes that improve access, confidence and continuity.', NULL, NULL, NULL, NULL, NULL, '/images/education.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 1, 0, '2026-09-17 07:07:34', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(2, NULL, 1, 1, 'gallery', 'Community Health Outreach', 'community-health-outreach', 'Moments from community health awareness activities.', NULL, NULL, NULL, NULL, NULL, NULL, '/images/healthcare.jpg', '/images/healthcare.jpg', '/images/volunteer.jpg', NULL, NULL, NULL, NULL, NULL, 'published', 1, 0, '2026-09-17 07:07:34', '2026-09-17 07:07:34', '2026-09-17 07:37:30', '2026-09-17 07:37:30'),
(3, NULL, 1, 1, 'impact_stories', 'Women Leading Local Change', 'women-leading-local-change', 'Skills and awareness helping women participate with confidence.', 'A story of community participation, support and new possibilities.', NULL, NULL, NULL, NULL, NULL, '/images/elderly.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 1, 0, '2026-09-17 07:07:34', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(4, NULL, 1, 1, 'blogs', 'Why Local Voices Matter', 'why-local-voices-matter', 'Community insight is the starting point for sustainable development.', NULL, 'Sustainable programmes begin by listening carefully to people closest to the challenge.', NULL, NULL, NULL, NULL, '/images/Blog.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'published', 1, 0, '2026-09-17 07:07:34', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(5, NULL, 1, NULL, 'gallery', 'This Is Demo', 'this-is-demo', 'Demo', '', NULL, 'demo', NULL, NULL, NULL, '/uploads/gallery/4cf7acc4-dea7-457e-b2dd-2e1e42efc9f9.png', '/uploads/gallery/03d39449-b779-4656-8191-adaf21e3c3b8.png', '', '', '', NULL, NULL, NULL, 'published', 1, 0, '2026-09-17 07:38:58', '2026-09-17 07:38:58', '2026-09-17 07:38:58', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`id`, `user_id`, `transaction_uuid`, `donation_number`, `amount`, `currency`, `donor_name`, `email`, `phone`, `address`, `city`, `state`, `country`, `pincode`, `pan_number`, `message`, `anonymous_donation`, `gateway`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `status`, `payment_method`, `failure_reason`, `receipt_number`, `paid_at`, `refunded_at`, `metadata`, `created_at`, `updated_at`, `deleted_at`, `gateway_id`, `gateway_order_id`, `gateway_payment_id`, `gateway_credentials`) VALUES
(1, 1, 'ce7a14fc-6678-445a-a704-b10f3d3c2ab9', '1581539500', 5000.00, 'INR', 'Super Admin', 'admin@sififoundation.org', '8863897163', NULL, NULL, NULL, NULL, NULL, NULL, 'one-time donation for Education', 0, 'razorpay', 'order_Td1sNrwGWp5wTS', 'pay_Td1sjBLSDdyfA8', NULL, 'captured', 'wallet', NULL, 'SIFI-1', '2026-09-17 07:57:03', NULL, NULL, '2026-09-17 07:56:23', '2026-09-17 07:57:03', NULL, 1, 'order_Td1sNrwGWp5wTS', 'pay_Td1sjBLSDdyfA8', 'Bf/zmcPvzd43pI7A.lrg19Sh2Q8l/DWI9diTzDA==.bPC27+w51Xk96B5TdK8GHKlCNEfMFvULcIQsT2Rz0TlfDqjP+fZG0V0ut9QVGmDgzNZJqvrxp0d9palsKA6CMWyKOssw38RrtyeIcb2jDAtl9ue7C4bNZlRuEAhXHI8jZFnks8ZfJUXRM21C0kPWHgqU');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_gateways`
--

INSERT INTO `payment_gateways` (`id`, `name`, `provider`, `mode`, `public_key`, `secret_key`, `active_slot`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Razorpay', 'razorpay', 'test', 'rzp_test_2j90j6WRmNXEgd', 'fCKj6bAETNiVP+pm.8EoyHBmVr8MdAjGkjLkR0A==.F6SFBSSCbGwQB76RZBredywGouYU1vFx', 1, '2026-09-17 07:55:40', '2026-09-17 07:55:47', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `slug`, `module`, `action`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'users view', 'users.view', 'users', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(2, 'users create', 'users.create', 'users', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(3, 'users edit', 'users.edit', 'users', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(4, 'users delete', 'users.delete', 'users', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(5, 'users status', 'users.status', 'users', 'status', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(6, 'users permissions', 'users.permissions', 'users', 'permissions', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(7, 'roles view', 'roles.view', 'roles', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(8, 'roles create', 'roles.create', 'roles', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(9, 'roles edit', 'roles.edit', 'roles', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(10, 'roles delete', 'roles.delete', 'roles', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(11, 'permissions view', 'permissions.view', 'permissions', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(12, 'permissions create', 'permissions.create', 'permissions', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(13, 'permissions edit', 'permissions.edit', 'permissions', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(14, 'permissions delete', 'permissions.delete', 'permissions', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(15, 'gallery view', 'gallery.view', 'gallery', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(16, 'gallery create', 'gallery.create', 'gallery', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(17, 'gallery edit', 'gallery.edit', 'gallery', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(18, 'gallery delete', 'gallery.delete', 'gallery', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(19, 'gallery publish', 'gallery.publish', 'gallery', 'publish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(20, 'gallery unpublish', 'gallery.unpublish', 'gallery', 'unpublish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(21, 'programmes view', 'programmes.view', 'programmes', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(22, 'programmes create', 'programmes.create', 'programmes', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(23, 'programmes edit', 'programmes.edit', 'programmes', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(24, 'programmes delete', 'programmes.delete', 'programmes', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(25, 'programmes publish', 'programmes.publish', 'programmes', 'publish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(26, 'programmes unpublish', 'programmes.unpublish', 'programmes', 'unpublish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(27, 'impact stories view', 'impact_stories.view', 'impact_stories', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(28, 'impact stories create', 'impact_stories.create', 'impact_stories', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(29, 'impact stories edit', 'impact_stories.edit', 'impact_stories', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(30, 'impact stories delete', 'impact_stories.delete', 'impact_stories', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(31, 'impact stories publish', 'impact_stories.publish', 'impact_stories', 'publish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(32, 'impact stories unpublish', 'impact_stories.unpublish', 'impact_stories', 'unpublish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(33, 'blogs view', 'blogs.view', 'blogs', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(34, 'blogs create', 'blogs.create', 'blogs', 'create', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(35, 'blogs edit', 'blogs.edit', 'blogs', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(36, 'blogs delete', 'blogs.delete', 'blogs', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(37, 'blogs publish', 'blogs.publish', 'blogs', 'publish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(38, 'blogs unpublish', 'blogs.unpublish', 'blogs', 'unpublish', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(39, 'settings view', 'settings.view', 'settings', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(40, 'settings edit', 'settings.edit', 'settings', 'edit', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(41, 'contact messages view', 'contact_messages.view', 'contact_messages', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(42, 'contact messages read', 'contact_messages.read', 'contact_messages', 'read', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(43, 'contact messages archive', 'contact_messages.archive', 'contact_messages', 'archive', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(44, 'contact messages delete', 'contact_messages.delete', 'contact_messages', 'delete', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(45, 'donations view', 'donations.view', 'donations', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(46, 'donations details', 'donations.details', 'donations', 'details', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(47, 'donations invoice', 'donations.invoice', 'donations', 'invoice', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(48, 'donations export', 'donations.export', 'donations', 'export', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(49, 'transactions view', 'transactions.view', 'transactions', 'view', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(50, 'transactions details', 'transactions.details', 'transactions', 'details', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(51, 'transactions export', 'transactions.export', 'transactions', 'export', NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Admin', 'super-admin', 'Super Admin role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(2, 'Admin', 'admin', 'Admin role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(3, 'Manager', 'manager', 'Manager role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(4, 'Staff', 'staff', 'Staff role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(5, 'User', 'user', 'User role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL),
(6, 'Donor', 'donor', 'Donor role', 'active', '2026-09-17 07:07:34', '2026-09-17 07:07:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `group`, `key`, `value`, `type`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'general', 'website_name', 'Social Initiative for India Foundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(2, 'general', 'website_title', 'sifi fundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(3, 'general', 'tagline', 'Health | Learn | Skill | Earn', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(4, 'general', 'copyright_text', 'Social Initiative for India Foundation. All Rights Reserved.', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(5, 'header', 'header_phone', '0651-3591618', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(6, 'header', 'header_email', 'info@sififoundation.org', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(7, 'footer', 'footer_content', 'Creating opportunities and strengthening communities.', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(8, 'contact', 'primary_email', 'info@sififoundation.org', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(9, 'contact', 'phone', '0651-3591618', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(10, 'contact', 'address', 'C/22, Patel Park, Harmu Housing Colony, Ranchi - 834002, Jharkhand, India', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(11, 'social', 'facebook', 'https://www.facebook.com/sififoundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(12, 'social', 'instagram', 'https://www.instagram.com/sififoundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(13, 'social', 'linkedin', 'https://www.linkedin.com/company/sifi-foundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL),
(14, 'social', 'youtube', 'https://www.youtube.com/@sififoundation', 'text', '2026-09-17 07:07:34', '2026-09-17 07:45:03', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `phone`, `alternate_phone`, `profile_photo`, `cover_photo`, `date_of_birth`, `gender`, `address`, `city`, `state`, `country`, `pincode`, `designation`, `status`, `email_verified_at`, `last_login_at`, `password`, `reset_token_hash`, `reset_token_expires_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Super Admin', 'admin@sififoundation.org', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-09-17 07:07:34', '2026-09-17 08:26:50', '$2a$12$yWFUHpgoS58ti7qWY2.hieCCw9MccyRG/KJVYX1bnTVKPMh1GF1Jm', NULL, NULL, '2026-09-17 07:07:34', '2026-09-17 08:26:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payment_gateways`
--
ALTER TABLE `payment_gateways`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

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
