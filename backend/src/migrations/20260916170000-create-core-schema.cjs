"use strict";

const contentModules = ["gallery", "programmes", "impact_stories", "blogs"];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: Sequelize.TEXT,
      status: { type: Sequelize.ENUM("active", "inactive"), defaultValue: "active" },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("permissions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      module: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      status: { type: Sequelize.ENUM("active", "inactive"), defaultValue: "active" },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      role_id: { type: Sequelize.INTEGER, references: { model: "roles", key: "id" }, onDelete: "SET NULL" },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: Sequelize.STRING,
      alternate_phone: Sequelize.STRING,
      profile_photo: Sequelize.STRING,
      cover_photo: Sequelize.STRING,
      date_of_birth: Sequelize.DATEONLY,
      gender: Sequelize.STRING,
      address: Sequelize.TEXT,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      pincode: Sequelize.STRING,
      designation: Sequelize.STRING,
      status: { type: Sequelize.ENUM("active", "inactive", "blocked"), defaultValue: "active" },
      email_verified_at: Sequelize.DATE,
      last_login_at: Sequelize.DATE,
      password: { type: Sequelize.STRING, allowNull: false },
      reset_token_hash: Sequelize.STRING,
      reset_token_expires_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("role_permissions", {
      role_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "roles", key: "id" }, onDelete: "CASCADE" },
      permission_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "permissions", key: "id" }, onDelete: "CASCADE" }
    });
    await queryInterface.createTable("user_permissions", {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "users", key: "id" }, onDelete: "CASCADE" },
      permission_id: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "permissions", key: "id" }, onDelete: "CASCADE" }
    });
    await queryInterface.createTable("settings", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      group: { type: Sequelize.STRING, allowNull: false },
      key: { type: Sequelize.STRING, allowNull: false },
      value: Sequelize.TEXT,
      type: { type: Sequelize.STRING, defaultValue: "text" },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.addIndex("settings", ["group", "key"], { unique: true });
    await queryInterface.createTable("blog_categories", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: Sequelize.TEXT,
      status: { type: Sequelize.ENUM("active", "inactive"), defaultValue: "active" },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("contents", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category_id: { type: Sequelize.INTEGER, references: { model: "blog_categories", key: "id" }, onDelete: "SET NULL" },
      created_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" }, onDelete: "SET NULL" },
      updated_by: { type: Sequelize.INTEGER, references: { model: "users", key: "id" }, onDelete: "SET NULL" },
      module: { type: Sequelize.ENUM(...contentModules), allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false },
      short_description: Sequelize.TEXT,
      description: Sequelize.TEXT("long"),
      content: Sequelize.TEXT("long"),
      category: Sequelize.STRING,
      tags: Sequelize.JSON,
      meta_title: Sequelize.STRING,
      meta_description: Sequelize.TEXT,
      featured_image: Sequelize.STRING,
      image1: Sequelize.STRING,
      image2: Sequelize.STRING,
      image3: Sequelize.STRING,
      image4: Sequelize.STRING,
      video_url: Sequelize.STRING,
      document_file: Sequelize.STRING,
      payload: Sequelize.JSON,
      status: { type: Sequelize.ENUM("draft", "published", "unpublished", "scheduled"), defaultValue: "draft" },
      featured: { type: Sequelize.BOOLEAN, defaultValue: false },
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      published_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.addIndex("contents", ["module", "slug"], { unique: true });
    await queryInterface.createTable("contact_messages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: Sequelize.STRING,
      subject: Sequelize.STRING,
      message: { type: Sequelize.TEXT, allowNull: false },
      ip_address: Sequelize.STRING,
      user_agent: Sequelize.TEXT,
      status: { type: Sequelize.ENUM("unread", "read", "archived"), defaultValue: "unread" },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
    await queryInterface.createTable("donations", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" }, onDelete: "RESTRICT" },
      transaction_uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      donation_number: { type: Sequelize.STRING(10), unique: true },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      currency: { type: Sequelize.STRING(3), defaultValue: "INR" },
      donor_name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      address: Sequelize.TEXT,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      pincode: Sequelize.STRING,
      pan_number: Sequelize.STRING,
      message: Sequelize.TEXT,
      anonymous_donation: { type: Sequelize.BOOLEAN, defaultValue: false },
      gateway: { type: Sequelize.STRING, defaultValue: "razorpay" },
      razorpay_order_id: { type: Sequelize.STRING, unique: true },
      razorpay_payment_id: { type: Sequelize.STRING, unique: true },
      razorpay_signature: Sequelize.STRING,
      status: { type: Sequelize.ENUM("created", "pending", "authorized", "captured", "failed", "refunded", "cancelled"), defaultValue: "created" },
      payment_method: Sequelize.STRING,
      failure_reason: Sequelize.TEXT,
      receipt_number: Sequelize.STRING,
      paid_at: Sequelize.DATE,
      refunded_at: Sequelize.DATE,
      metadata: Sequelize.JSON,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });
    await queryInterface.createTable("audit_logs", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" }, onDelete: "SET NULL" },
      action: { type: Sequelize.STRING, allowNull: false },
      module: { type: Sequelize.STRING, allowNull: false },
      record_id: Sequelize.STRING,
      old_values: Sequelize.JSON,
      new_values: Sequelize.JSON,
      ip_address: Sequelize.STRING,
      user_agent: Sequelize.TEXT,
      created_at: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("donations");
    await queryInterface.dropTable("contact_messages");
    await queryInterface.dropTable("contents");
    await queryInterface.dropTable("blog_categories");
    await queryInterface.dropTable("settings");
    await queryInterface.dropTable("user_permissions");
    await queryInterface.dropTable("role_permissions");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("permissions");
    await queryInterface.dropTable("roles");
  }
};
