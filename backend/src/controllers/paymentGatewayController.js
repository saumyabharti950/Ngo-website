import { PaymentGateway, sequelize } from "../models/index.js";
import { asyncHandler, ok, ApiError } from "../utils/response.js";
import { encryptSecret, decryptSecret } from "../utils/paymentSecrets.js";

export const gatewayView = (item) => ({ id: item.id, name: item.name, provider: item.provider, mode: item.mode, publicKey: item.publicKey, active: item.activeSlot === 1, hasSecret: true });
export const listGateways = asyncHandler(async (_req, res) => ok(res, (await PaymentGateway.findAll({ order: [["id", "ASC"]] })).map(gatewayView)));

export const saveGateway = asyncHandler(async (req, res) => {
  const { name, provider, publicKey, secretKey, mode } = req.body;
  if (typeof name !== "string" || !name.trim() || typeof publicKey !== "string" || !publicKey.trim() || (secretKey != null && typeof secretKey !== "string") || !["razorpay", "stripe", "cashfree"].includes(provider) || !["test", "live"].includes(mode)) throw new ApiError(422, "Name, provider, mode and public key / app ID are required");
  const existing = req.params.id ? await PaymentGateway.unscoped().findByPk(req.params.id) : null;
  if (req.params.id && !existing) throw new ApiError(404, "Gateway not found");
  if (!secretKey?.trim() && (!existing || existing.provider !== provider)) throw new ApiError(422, "A secret key is required");
  if (provider === "razorpay" && !publicKey.trim().startsWith(`rzp_${mode}_`)) throw new ApiError(422, "Razorpay Key ID must match the selected test/live mode");
  if (provider === "stripe") {
    const secret = secretKey?.trim() || decryptSecret(existing.secretKey);
    if (!publicKey.trim().startsWith(`pk_${mode}_`) || !new RegExp(`^(sk|rk)_${mode}_`).test(secret)) throw new ApiError(422, "Stripe keys must match the selected test/live mode");
  }
  const values = { name: name.trim(), provider, mode, publicKey: publicKey.trim(), secretKey: secretKey?.trim() ? encryptSecret(secretKey.trim()) : existing.secretKey };
  const item = existing ? await existing.update(values) : await PaymentGateway.create(values);
  ok(res, gatewayView(item), "Gateway saved", existing ? 200 : 201);
});

export const activateGateway = asyncHandler(async (req, res) => {
  await sequelize.transaction(async (transaction) => {
    // The unique active_slot index enforces a single active gateway, including concurrent requests.
    await PaymentGateway.update({ activeSlot: null }, { where: { activeSlot: 1 }, transaction });
    const item = await PaymentGateway.unscoped().findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!item) throw new ApiError(404, "Gateway not found");
    decryptSecret(item.secretKey);
    await item.update({ activeSlot: 1 }, { transaction });
  });
  ok(res, {}, "Gateway activated");
});

export const deactivateGateway = asyncHandler(async (req, res) => {
  const item = await PaymentGateway.findByPk(req.params.id);
  if (!item) throw new ApiError(404, "Gateway not found");
  await item.update({ activeSlot: null });
  ok(res, {}, "Gateway deactivated");
});

export const deleteGateway = asyncHandler(async (req, res) => {
  await sequelize.transaction(async (transaction) => {
    const item = await PaymentGateway.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!item) throw new ApiError(404, "Gateway not found");
    if (item.activeSlot === 1) throw new ApiError(409, "Deactivate this gateway before deleting it");
    await item.destroy({ transaction });
  });
  ok(res, {}, "Gateway deleted");
});
