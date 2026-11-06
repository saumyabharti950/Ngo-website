import crypto from "node:crypto";
import { ApiError } from "./response.js";

function encryptionKey() {
  const secret = process.env.PAYMENT_ENCRYPTION_KEY || process.env.JWT_SECRET || "sifi_foundation_donation_secure_key_default_32chars";
  return crypto.createHash("sha256").update(`sifi-payment:${secret}`).digest();
}

export function encryptSecret(value) {
  if (value === null || value === undefined) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64")).join(".");
}

export function decryptSecret(value) {
  if (!value || typeof value !== "string") return "";
  try {
    const parts = value.split(".");
    if (parts.length !== 3) return value;
    const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, "base64"));
    const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return value;
  }
}

export function sameSignature(expected, actual) {
  if (typeof actual !== "string") return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
