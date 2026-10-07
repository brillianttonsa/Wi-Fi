import type { RequestHandler } from "express";
import { serializeUser } from "../lib/serializers.js";
import { updateProfile as updateProfileService } from "../services/auth.service.js";

export const updateProfile: RequestHandler = async (request, response) => {
  const user = await updateProfileService(request.auth!.userId, request.body);
  response.json({ user: serializeUser(user) });
};
