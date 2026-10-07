import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { serializeUser } from "../lib/serializers.js";
import * as authService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register: RequestHandler = async (request, response) => {
  const user = await authService.register(request.body);
  response.status(201).cookie("access_token", authService.createAccessToken(user.id), cookieOptions).json({ user: serializeUser(user) });
};

export const login: RequestHandler = async (request, response) => {
  const user = await authService.login(request.body.phone, request.body.password);
  response.cookie("access_token", authService.createAccessToken(user.id), cookieOptions).json({ user: serializeUser(user) });
};

export const me: RequestHandler = async (request, response) => {
  const user = await authService.findUser(request.auth!.userId);
  response.json({ user: serializeUser(user) });
};

export const logout: RequestHandler = (_request, response) => {
  response.clearCookie("access_token", { httpOnly: true, sameSite: "lax", secure: env.NODE_ENV === "production", path: "/" }).sendStatus(204);
};
