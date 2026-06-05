// import { Request, Response } from "express";

import { FastifyReply, FastifyRequest } from "fastify";

import AuthService from "../services/authService.js";
import asyncHandler from "../utils/common/asyncHandler.js";
import { UnauthorizedError } from "../utils/errors/error.js";
import { sendSuccess } from "../utils/common/response.js";
import { STATUS_CODES } from "../utils/common/constants.js";
import { LoginBody, RegisterBody } from "../types/index.js";
import cookieOption from "../utils/common/cookieOptions.js";
import { sendPasswordlessLoginEmail } from "../utils/helpers/email.js";
import { buildUrl } from "../utils/helpers/buildUrl.js";

const authService = new AuthService();

type RegisterRequest = FastifyRequest<{
  Body: RegisterBody;
}>;
type LoginRequest = FastifyRequest<{
  Body: LoginBody;
}>;
type RefreshTokenRequest = FastifyRequest<{
  Body: { refreshToken: string };
}>;

type GoogleCallbackRequest = FastifyRequest<{
  Querystring: {
    code?: string;
    state?: string;
    error?: string;
  };
}>;

export const googleLogin = asyncHandler(
  async (_req: FastifyRequest, res: FastifyReply) => {
    const state = authService.generateOAuthState();
    const authUrl = authService.getGoogleAuthUrl(state);

    res.setCookie("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
    });

    return res.redirect(authUrl);
  },
);

export const googleCallback = asyncHandler(
  async (req: GoogleCallbackRequest, res: FastifyReply) => {
    const { code, state, error } = req.query;

    if (error) {
      throw new UnauthorizedError("Google OAuth was denied.", { error });
    }

    if (!code || !state) {
      throw new UnauthorizedError("Missing Google OAuth callback parameters.");
    }

    const cookieState = req.cookies?.oauth_state;
    if (!cookieState || cookieState !== state) {
      throw new UnauthorizedError("Invalid OAuth state.");
    }

    res.clearCookie("oauth_state");

    const result = await authService.loginWithGoogleCode(code);
    res.setCookie("refreshToken", result.tokens.refreshToken, cookieOption("refresh"));

    return sendSuccess(
      res,
      "Google login successful",
      { user: result.user, accessToken: result.tokens.accessToken },
      STATUS_CODES.OK,
    );
  },
);

export const passless = asyncHandler(
  async (req: FastifyRequest<{ Body: { email: string } }>, res: FastifyReply) => {
    let { email, name, token, role } = await authService.passless(req.body.email);
    let link = buildUrl(req, {
      prefix: "/api/v1/auth",
      path: "/magic/verify",
      query: { token, role },
    });
    await sendPasswordlessLoginEmail(email, name ?? "User", 5, link);
    sendSuccess(res, "Passwordless login link successfully sent", link, 200);
  },
);
export const testPassless = asyncHandler(
  async (req: FastifyRequest, res: FastifyReply) => {
    let { email, name, token, role } = await authService.testPassless();

    let link = buildUrl(req, {
      prefix: "/api/v1/auth",
      path: "/test/magic/verify",
      query: { token, role },
    });
    await sendPasswordlessLoginEmail(email, name ?? "User", 5, link);
    sendSuccess(res, "Test passwordless login link successfully sent", link, 200);
  },
);
export const passlessVerify = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        token: string;
        role: string;
      };
    }>,
    res: FastifyReply,
  ) => {
    let { token, role } = req.query;
    let response = await authService.passlessVerify(token, role);

    sendSuccess(res, "Welcome back", response, 200);
  },
);
export const testPasslessVerify = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        token: string;
        role: string;
      };
    }>,
    res: FastifyReply,
  ) => {
    let { token, role } = req.query;
    let response = await authService.testPasslessVerify(token, role);

    sendSuccess(res, "Test Welcome back", response, 200);
  },
);

export const register = asyncHandler(
  async (req: RegisterRequest, res: FastifyReply): Promise<any> => {
    // console.log(req)
    const result = await authService.register(req.body);

    res.setCookie("refreshToken", result.tokens.refreshToken, cookieOption("refresh"));
    res.setCookie("accessToken", result.tokens.accessToken, cookieOption("access"));

    sendSuccess(
      res,
      "Registration successful",
      { user: result.user, accessToken: result.tokens.accessToken },
      STATUS_CODES.CREATED,
    );
  },
);

export const login = asyncHandler(async (req: LoginRequest, res: FastifyReply) => {
  const { email, password, totpToken } = req.body;
  const result = await authService.login(email, password, totpToken);

  if (result.requireTotp) {
    sendSuccess(
      res,
      "TOTP required",
      { requireTotp: true, userId: result.user.id },
      STATUS_CODES.OK,
    );
    return;
  }

  res.cookie("refreshToken", result.tokens.refreshToken, cookieOption("refresh"));
  res.cookie("accessToken", result.tokens.accessToken, cookieOption("access"));

  sendSuccess(
    res,
    "Login successful",
    { user: result.user, accessToken: result.tokens.accessToken },
    STATUS_CODES.OK,
  );
});

export const logout = asyncHandler(async (req: FastifyRequest, res: FastifyReply) => {
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken || "";
  await authService.logout(req.user!.id, token);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  sendSuccess(res, "Logout successful", null, STATUS_CODES.OK);
});

export const refreshToken = asyncHandler(
  async (req: RefreshTokenRequest, res: FastifyReply) => {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const tokens = await authService.refreshTokens(token as string);

    res.cookie("refreshToken", tokens.refreshToken, cookieOption("refresh"));
    res.cookie("accessToken", tokens.accessToken, cookieOption("access"));

    sendSuccess(
      res,
      "Token refreshed",
      { accessToken: tokens.accessToken },
      STATUS_CODES.OK,
    );
  },
);

export const changePassword = asyncHandler(
  async (
    req: FastifyRequest<{ Body: { currentPassword: string; newPassword: string } }>,
    res: FastifyReply,
  ) => {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.accessToken || "";
    await authService.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword,
      token,
    );
    res.clearCookie("refreshToken");
    sendSuccess(res, "Password changed successfully", null, STATUS_CODES.OK);
  },
);

export const enableTotp = asyncHandler(
  async (
    req: FastifyRequest<{ Body: { userId: string; password: string } }>,
    res: FastifyReply,
  ) => {
    const result = await authService.enableTotp(req.user!.id, req.body.password);
    sendSuccess(
      res,
      "TOTP setup initiated. Scan QR code and verify.",
      result,
      STATUS_CODES.OK,
    );
  },
);

export const verifyTotp = asyncHandler(
  async (
    req: FastifyRequest<{ Body: { userId: string; token: string } }>,
    res: FastifyReply,
  ) => {
    await authService.verifyAndActivateTotp(req.user!.id, req.body.token);
    sendSuccess(res, "TOTP enabled successfully", null, STATUS_CODES.OK);
  },
);

export const disableTotp = asyncHandler(
  async (
    req: FastifyRequest<{ Body: { userId: string; password: string } }>,
    res: FastifyReply,
  ) => {
    await authService.disableTotp(req.user!.id, req.body.password);
    sendSuccess(res, "TOTP disabled successfully", null, STATUS_CODES.OK);
  },
);
