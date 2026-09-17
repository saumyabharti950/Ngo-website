import crypto from "node:crypto";
import { ApiError } from "./response.js";

function encryptionKey() {
  const secret = process.env.PAYMENT_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new ApiError(503, "Payment encryption needs a server secret of at least 32 characters");
  return crypto.createHash("sha256").update(`sifi-payment:${secret}`).digest();
}

export function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64")).join(".");
}

export function decryptSecret(value) {
  const [iv, tag, ciphertext] = value.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function sameSignature(expected, actual) {
  if (typeof actual !== "string") return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
