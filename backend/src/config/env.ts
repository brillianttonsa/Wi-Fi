import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters."),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PAYMENT_GATEWAY: z.enum(["sandbox", "azampay"]).default("sandbox"),
  PAYMENT_WEBHOOK_TOKEN: z.string().optional(),
  AZAMPAY_APP_NAME: z.string().optional(),
  AZAMPAY_CLIENT_ID: z.string().optional(),
  AZAMPAY_CLIENT_SECRET: z.string().optional(),
  AZAMPAY_API_KEY: z.string().optional(),
  AZAMPAY_SANDBOX: z.enum(["true", "false"]).optional().default("true").transform((value) => value === "true"),
}).superRefine((value, context) => {
  if (value.PAYMENT_GATEWAY !== "azampay") return;
  for (const key of ["AZAMPAY_APP_NAME", "AZAMPAY_CLIENT_ID", "AZAMPAY_CLIENT_SECRET", "AZAMPAY_API_KEY"] as const) {
    if (!value[key]) {
      context.addIssue({ code: "custom", message: `${key} is required when PAYMENT_GATEWAY=azampay.`, path: [key] });
    }
  }
});

export const env = schema.parse(process.env);
