import type { ErrorRequestHandler } from "express";
import { HttpError } from "./httpError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};

