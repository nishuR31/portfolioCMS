// import { Response } from "express";

import { FastifyReply } from "fastify";

export function sendSuccess(
  res: FastifyReply,
  message: string,
  data: any = null,
  statusCode: number = 200,
  extra?: Record<string, any>,
) {
  return res.code(statusCode).send({
    success: true,
    message,
    data,
    ...(extra && extra),
  });
}

export function sendError(
  res: FastifyReply,
  message: String = "Error",
  statusCode: number = 500,
  errors?: any,
) {
  return res
    .code(statusCode)
    .send({ success: false, message, ...(errors && { errors }) });
}
