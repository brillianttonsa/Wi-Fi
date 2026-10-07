import type { RequestHandler } from "express";

export const asyncHandler = (handler: RequestHandler): RequestHandler =>
  (request, response, next) => void Promise.resolve(handler(request, response, next)).catch(next);
