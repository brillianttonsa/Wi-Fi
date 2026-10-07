import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http-error.js";

export const notFound: RequestHandler = (request, _response, next) =>
  next(new HttpError(404, `Route ${request.method} ${request.path} was not found.`));

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    return response.status(400).json({ error: error.issues[0]?.message ?? "Invalid request data." });
  }
  if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
  console.error(error);
  return response.status(500).json({ error: "An unexpected server error occurred." });
};
