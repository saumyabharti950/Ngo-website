import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { AuditLog, Permission, Role, User } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { makeSlug } from "../utils/slug.js";

const pagination = (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  return { page, limit, offset: (page - 1) * limit };
};

const searchable = (query, fields) => query.search ? { [Op.or]: fields.map((field) => ({ [field]: { [Op.like]: `%${query.search}%` } })) } : {};

const audit = (req, action, module, record, oldValues = null) => AuditLog.create({
  UserId: req.user.id,
  action,
  module,
  recordId: String(record?.id || ""),
  oldValues,
  newValues: record?.toJSON?.() || record,
  ipAddress: req.ip,
  userAgent: req.get("user-agent")
});

export const dashboard = asyncHandler(async (_req, res) => {
  const [totalUsers, activeUsers, roles, permissions] = await Promise.all([
    User.count(),
    User.count({ where: { status: "active" } }),
    Role.count(),
    Permission.count()
  ]);
  ok(res, { totalUsers, activeUsers, roles, permissions });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { limit, offset, page } = pagination(req.query);
  const result = await User.findAndCountAll({ where: searchable(req.query, ["name", "email", "phone"]), include: [Role, Permission], limit, offset, order: [["createdAt", "DESC"]] });
  ok(res, { rows: result.rows, total: result.count, page, limit });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body, password: await bcrypt.hash(req.body.password || "ChangeMe123!", 12), RoleId: req.body.roleId });
  if (req.body.permissionIds) await user.setPermissions(req.body.permissionIds);
  await audit(req, "create", "users", user);
  ok(res, user, "User created", 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  const oldValues = user.toJSON();
  await user.update({ ...req.body, RoleId: req.body.roleId ?? user.RoleId, password: req.body.password ? await bcrypt.hash(req.body.password, 12) : user.password });
  if (req.body.permissionIds) await user.setPermissions(req.body.permissionIds);
  await audit(req, "update", "users", user, oldValues);
  ok(res, user, "User updated");
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [Role] });
  if (!user) throw new ApiError(404, "User not found");
  if (user.Role?.slug === "super-admin" && await User.count({ include: [{ model: Role, where: { slug: "super-admin" } }] }) <= 1) throw new ApiError(409, "Cannot remove the last Super Admin");
  await audit(req, "delete", "users", user);
  await user.destroy();
  ok(res, {}, "User deleted");
});

export const listRoles = asyncHandler(async (req, res) => ok(res, await Role.findAll({ include: [Permission], order: [["name", "ASC"]] })));
export const createRole = asyncHandler(async (req, res) => {
  const role = await Role.create({ ...req.body, slug: req.body.slug || makeSlug(req.body.name) });
  if (req.body.permissionIds) await role.setPermissions(req.body.permissionIds);
  await audit(req, "create", "roles", role);
  ok(res, role, "Role created", 201);
});
export const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  await role.update({ ...req.body, slug: req.body.slug || role.slug });
  if (req.body.permissionIds) await role.setPermissions(req.body.permissionIds);
  await audit(req, "update", "roles", role);
  ok(res, role, "Role updated");
});
export const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  if (role.slug === "super-admin") throw new ApiError(409, "Super Admin role cannot be deleted");
  await role.destroy();
  ok(res, {}, "Role deleted");
});

export const listPermissions = asyncHandler(async (_req, res) => ok(res, await Permission.findAll({ order: [["module", "ASC"], ["action", "ASC"]] })));
export const savePermission = asyncHandler(async (req, res) => {
  const payload = { ...req.body, slug: req.body.slug || `${makeSlug(req.body.module)}.${makeSlug(req.body.action)}` };
  const item = req.params.id ? await Permission.findByPk(req.params.id) : null;
  if (item) {
    await item.update(payload);
    return ok(res, item, "Permission updated");
  }
  ok(res, await Permission.create(payload), "Permission created", 201);
});

export const deletePermission = asyncHandler(async (req, res) => {
  const permission = await Permission.findByPk(req.params.id);
  if (!permission) throw new ApiError(404, "Permission not found");
  await permission.destroy();
  ok(res, {}, "Permission deleted");
});

export const listAuditLogs = asyncHandler(async (_req, res) => {
  const rows = await AuditLog.findAll({ include: [User], order: [["createdAt", "DESC"]], limit: 200 });
  ok(res, rows);
});
