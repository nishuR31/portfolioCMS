// src/controllers/deleteAllController.ts
import asyncHandler from "../utils/common/asyncHandler.js";
import { SMTP_USER } from "../config/envConfig.js"
import { sendSuccess } from "../utils/common/response.js";
import { STATUS_CODES } from "../utils/common/constants.js";
import { confirmDelete, sendDeleteAll } from "../services/deleteAllService.js";
import { UnauthorizedError } from "../utils/errors/error.js";
import { } from "../utils/helpers/email.js";

const adminEmail = SMTP_USER;
// GET /admin/delete-all/request
export const requestDeleteAll = asyncHandler(async (req, res) => {
  if (!adminEmail) {
    throw new UnauthorizedError("Admin Email not available");
  }
  await sendDeleteAll();
  sendSuccess(res, "Delete‑all OTP sent to admin", null, STATUS_CODES.OK);
});

// POST /admin/delete-all/confirm
export const confirmDeleteAll = asyncHandler(async (req, res) => {
  const { otp, password } = req.body as { otp: string; password: string }
  if (!otp || !password) {
    throw new UnauthorizedError("Both OTP and Password are required");
  }
  await confirmDelete(otp, password);
  sendSuccess(res, "All data deleted successfully", null, STATUS_CODES.OK);
});
