import { Router } from "express";
import { z } from "zod";
import * as controller from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../lib/async-handler.js";

const router = Router();
const phone = z.string().trim().min(7, "Enter a valid phone number.").max(30);
const password = z.string().min(8, "Password must be at least 8 characters.").max(128);
const registration = z.object({ fullName: z.string().trim().min(2, "Enter your full name.").max(120), phone, email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")), password });
const login = z.object({ phone, password: z.string().min(1, "Password is required.") });

router.post("/register", asyncHandler((req, _res, next) => { req.body = registration.parse(req.body); return controller.register(req, _res, next); }));
router.post("/login", asyncHandler((req, _res, next) => { req.body = login.parse(req.body); return controller.login(req, _res, next); }));
router.get("/me", authenticate, asyncHandler(controller.me));
router.post("/logout", authenticate, controller.logout);

export { router as authRouter };
