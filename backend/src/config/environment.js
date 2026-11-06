import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "../../");

dotenv.config({ path: path.join(backendRoot, ".env.local") });
dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: ".env.local" });
dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "sifi_ngo_jwt_secret_token_key_32_chars_long";
}
if (!process.env.PAYMENT_ENCRYPTION_KEY) {
  process.env.PAYMENT_ENCRYPTION_KEY = "sifi_ngo_payment_secret_encryption_32_characters";
}
