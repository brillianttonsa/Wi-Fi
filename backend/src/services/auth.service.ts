import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { users } from "../db/schema/index.js";
import { HttpError } from "../lib/http-error.js";

type Registration = { fullName: string; phone: string; email?: string; password: string };
type ProfileUpdate = { fullName: string; phone: string; email?: string; currentPassword?: string; newPassword?: string };

const normalisePhone = (phone: string) => phone.replace(/[\s()-]/g, "");
const normaliseEmail = (email?: string) => email?.trim().toLowerCase() || null;

export async function register(input: Registration) {
  const phone = normalisePhone(input.phone);
  const email = normaliseEmail(input.email);
  const [existing] = await db.select({ id: users.id }).from(users).where(email ? or(eq(users.phone, phone), eq(users.email, email)) : eq(users.phone, phone)).limit(1);
  if (existing) throw new HttpError(409, "An account with that phone number or email already exists.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db.insert(users).values({ fullName: input.fullName.trim(), phone, email, passwordHash }).returning();
  return user;
}

export async function login(phoneInput: string, password: string) {
  const phone = normalisePhone(phoneInput);
  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Incorrect phone number or password.");
  }
  return user;
}

export async function findUser(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new HttpError(401, "Your account no longer exists.");
  return user;
}

export async function updateProfile(userId: number, input: ProfileUpdate) {
  const current = await findUser(userId);
  const phone = normalisePhone(input.phone);
  const email = normaliseEmail(input.email);
  const [duplicate] = await db.select({ id: users.id }).from(users).where(email ? or(eq(users.phone, phone), eq(users.email, email)) : eq(users.phone, phone)).limit(1);
  if (duplicate && duplicate.id !== userId) throw new HttpError(409, "That phone number or email is already in use.");

  let passwordHash = current.passwordHash;
  if (input.newPassword) {
    if (!input.currentPassword || !(await bcrypt.compare(input.currentPassword, current.passwordHash))) {
      throw new HttpError(400, "Your current password is incorrect.");
    }
    passwordHash = await bcrypt.hash(input.newPassword, 12);
  }
  const [user] = await db.update(users).set({ fullName: input.fullName.trim(), phone, email, passwordHash, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
  return user;
}

export function createAccessToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
}
