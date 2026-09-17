import crypto from "crypto";
import { Donation } from "../models/index.js";

export async function generateDonationNumber(transaction) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const number = String(crypto.randomInt(1000000000, 9999999999));
    const exists = await Donation.findOne({ where: { donationNumber: number }, transaction });
    if (!exists) return number;
  }
  throw new Error("Unable to generate unique donation number");
}
