import { Router } from "express";
import { z } from "zod";
import * as controller from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../lib/async-handler.js";
import { providers } from "../lib/phone.js";

const router = Router();
const create = z.object({
  planName: z.string().trim().min(1),
  phone: z.string().trim().min(7, "Enter a valid payment phone number.").max(30),
  provider: z.enum(providers).optional(),
});
const activate = z.object({
  token: z.string().trim().min(6, "Enter the Wi-Fi token from your payment."),
});

router.post("/webhook/azampay", asyncHandler(controller.azamPayWebhook));
router.use(authenticate);
router.get("/", asyncHandler(controller.getPayments));
router.get("/wifi", asyncHandler(controller.getWifiStatus));
router.post("/wifi/activate", asyncHandler((req, res, next) => {
  req.body = activate.parse(req.body);
  return controller.activateWifi(req, res, next);
}));
router.get("/:reference", asyncHandler(controller.getPayment));
router.post("/", asyncHandler((req, res, next) => {
  req.body = create.parse(req.body);
  return controller.createPayment(req, res, next);
}));

export { router as paymentRouter };
