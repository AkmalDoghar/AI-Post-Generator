import bcrypt from "bcryptjs";

const PASSWORD_ROUNDS = 12;

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export async function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_ROUNDS);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
