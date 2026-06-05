// import { Request, Response, NextFunction } from "express";

import { FastifyReply, FastifyRequest } from "fastify";

import { verifyAccessToken } from "../utils/helpers/jwt.js";
import { UnauthorizedError } from "../utils/errors/error.js";
import asyncHandler from "../utils/common/asyncHandler.js";

export const authenticate = asyncHandler(
  async (req: FastifyRequest, res: FastifyReply) => {
    // Priority order:
    //  1. accessToken httpOnly cookie  (set on login — survives page refreshes)
    //  2. Authorization: Bearer header (API clients / mobile)
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      throw new UnauthorizedError("Access denied. No token provided. Please log in.");
    }

    const decoded = await verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  },
);
