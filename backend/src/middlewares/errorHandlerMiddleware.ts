// import { NextFunction, Request, Response } from "express";

import {FastifyReply,FastifyRequest} from "fastify";

import { AppError } from "../utils/errors/error.js";
import { NODE_ENV } from "../config/envConfig.js";
import { sendError } from "../utils/common/response.js";

export default function errorHandler(
  err: any,
  req: FastifyRequest,
  res: FastifyReply,
) {
  if (!(err instanceof AppError)) {
    err = new AppError(err.message || "Something went wrong.", err.statusCode || 500);
  }

  const { message, statusCode, name, stack, details } = err;

  console.error(`${name || "Error"}: ${message}`, {
    details,
    statusCode,
    stack,
    url: req.originalUrl,
    method: req.method,
  });

  const errDetails = NODE_ENV === "development" ? { name, stack, details } : undefined;

  sendError(res, message, statusCode, errDetails);
}
