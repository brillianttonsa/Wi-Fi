import { Router } from "express";
import { z } from "zod";
import { updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../lib/async-handler.js";

const router = Router();
const update = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
  currentPassword: z.string().max(128).optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters.").max(128).optional(),
}).refine((value) => Boolean(value.currentPassword) === Boolean(value.newPassword), { message: "Provide both current and new passwords to change your password." });

router.patch("/", authenticate, asyncHandler((req, res, next) => { req.body = update.parse(req.body); return updateProfile(req, res, next); }));
export { router as profileRouter };
