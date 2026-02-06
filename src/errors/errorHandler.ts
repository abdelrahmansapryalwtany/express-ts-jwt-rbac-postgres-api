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

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};

