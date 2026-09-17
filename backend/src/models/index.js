import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/database.cjs";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];
export const sequelize = new Sequelize(config.database, config.username, config.password, config);

const common = { underscored: true, paranoid: true };

export const Role = sequelize.define("Role", {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.TEXT,
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" }
}, common);

export const Permission = sequelize.define("Permission", {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  module: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" }
}, common);

export const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: DataTypes.STRING,
  alternatePhone: DataTypes.STRING,
  profilePhoto: DataTypes.STRING,
  coverPhoto: DataTypes.STRING,
  dateOfBirth: DataTypes.DATEONLY,
  gender: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  pincode: DataTypes.STRING,
  designation: DataTypes.STRING,
  status: { type: DataTypes.ENUM("active", "inactive", "blocked"), defaultValue: "active" },
  emailVerifiedAt: DataTypes.DATE,
  lastLoginAt: DataTypes.DATE,
  password: { type: DataTypes.STRING, allowNull: false },
  resetTokenHash: DataTypes.STRING,
  resetTokenExpiresAt: DataTypes.DATE
}, { ...common, defaultScope: { attributes: { exclude: ["password", "resetTokenHash"] } }, scopes: { withPassword: { attributes: {} } } });

export const RolePermission = sequelize.define("RolePermission", {}, { underscored: true, timestamps: false });
export const UserPermission = sequelize.define("UserPermission", {}, { underscored: true, timestamps: false });

export const Setting = sequelize.define("Setting", {
  group: { type: DataTypes.STRING, allowNull: false },
  key: { type: DataTypes.STRING, allowNull: false },
  value: DataTypes.TEXT,
  type: { type: DataTypes.STRING, defaultValue: "text" }
}, { ...common, indexes: [{ unique: true, fields: ["group", "key"] }] });

export const Content = sequelize.define("Content", {
  module: { type: DataTypes.ENUM("gallery", "programmes", "impact_stories", "blogs"), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  shortDescription: DataTypes.TEXT,
  description: DataTypes.TEXT("long"),
  content: DataTypes.TEXT("long"),
  category: DataTypes.STRING,
  tags: DataTypes.JSON,
  metaTitle: DataTypes.STRING,
  metaDescription: DataTypes.TEXT,
  featuredImage: DataTypes.STRING,
  image1: DataTypes.STRING,
  image2: DataTypes.STRING,
  image3: DataTypes.STRING,
  image4: DataTypes.STRING,
  videoUrl: DataTypes.STRING,
  documentFile: DataTypes.STRING,
  payload: DataTypes.JSON,
  status: { type: DataTypes.ENUM("draft", "published", "unpublished", "scheduled"), defaultValue: "draft" },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  publishedAt: DataTypes.DATE
}, { ...common, indexes: [{ unique: true, fields: ["module", "slug"] }, { fields: ["module", "status"] }] });

export const BlogCategory = sequelize.define("BlogCategory", {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.TEXT,
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" }
}, common);

export const ContactMessage = sequelize.define("ContactMessage", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
  subject: DataTypes.STRING,
  message: { type: DataTypes.TEXT, allowNull: false },
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.TEXT,
  status: { type: DataTypes.ENUM("unread", "read", "archived"), defaultValue: "unread" }
}, { ...common, paranoid: false });

export const Donation = sequelize.define("Donation", {
  transactionUuid: { type: DataTypes.UUID, allowNull: false, unique: true },
  donationNumber: { type: DataTypes.STRING(10), unique: true },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: "INR" },
  donorName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  pincode: DataTypes.STRING,
  panNumber: DataTypes.STRING,
  message: DataTypes.TEXT,
  anonymousDonation: { type: DataTypes.BOOLEAN, defaultValue: false },
  gateway: { type: DataTypes.STRING, defaultValue: "razorpay" },
  razorpayOrderId: { type: DataTypes.STRING, unique: true },
  razorpayPaymentId: { type: DataTypes.STRING, unique: true },
  razorpaySignature: DataTypes.STRING,
  status: { type: DataTypes.ENUM("created", "pending", "authorized", "captured", "failed", "refunded", "cancelled"), defaultValue: "created" },
  paymentMethod: DataTypes.STRING,
  failureReason: DataTypes.TEXT,
  receiptNumber: DataTypes.STRING,
  paidAt: DataTypes.DATE,
  refundedAt: DataTypes.DATE,
  metadata: DataTypes.JSON
}, common);

export const AuditLog = sequelize.define("AuditLog", {
  action: { type: DataTypes.STRING, allowNull: false },
  module: { type: DataTypes.STRING, allowNull: false },
  recordId: DataTypes.STRING,
  oldValues: DataTypes.JSON,
  newValues: DataTypes.JSON,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.TEXT
}, { underscored: true, timestamps: true, updatedAt: false });

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });
Role.hasMany(User);
User.belongsTo(Role);
User.belongsToMany(Permission, { through: UserPermission });
Permission.belongsToMany(User, { through: UserPermission });
User.hasMany(Donation);
Donation.belongsTo(User);
User.hasMany(Content, { foreignKey: "createdBy" });
Content.belongsTo(User, { as: "author", foreignKey: "createdBy" });
BlogCategory.hasMany(Content, { foreignKey: "categoryId" });
Content.belongsTo(BlogCategory, { as: "blogCategory", foreignKey: "categoryId" });
User.hasMany(AuditLog);
AuditLog.belongsTo(User);

export const models = { User, Role, Permission, RolePermission, UserPermission, Setting, Content, BlogCategory, ContactMessage, Donation, AuditLog };
