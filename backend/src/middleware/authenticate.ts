import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

export type AuthToken = { userId: number };

declare global {
  namespace Express {
    interface Request { auth?: AuthToken }
  }
}

export const authenticate: RequestHandler = (request, _response, next) => {
  const token = request.cookies.access_token;
  if (!token) return next(new HttpError(401, "Authentication is required."));

  try {
    request.auth = jwt.verify(token, env.JWT_SECRET) as AuthToken;
    next();
  } catch {
    next(new HttpError(401, "Your session has expired. Please log in again."));
  }
};
