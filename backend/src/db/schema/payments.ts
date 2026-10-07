import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const paymentStatus = pgEnum("payment_status", ["pending", "approved", "rejected"]);

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planName: text("plan_name").notNull(),
  amount: integer("amount").notNull(),
  paymentPhone: text("payment_phone").notNull(),
  provider: text("provider").notNull().default("Mpesa"),
  providerTransactionId: text("provider_transaction_id"),
  status: paymentStatus("status").notNull().default("pending"),
  reference: text("reference").notNull().unique(),
  wifiToken: text("wifi_token").unique(),
  tokenIssuedAt: timestamp("token_issued_at", { withTimezone: true }),
  activatedAt: timestamp("activated_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
