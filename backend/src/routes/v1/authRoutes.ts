// import { Router } from "express";
import {
  changePassword,
  disableTotp,
  enableTotp,
  googleCallback,
  googleLogin,
  login,
  logout,
  passless,
  passlessVerify,
  refreshToken,
  register,
  testPassless,
  testPasslessVerify,
  verifyTotp,
} from "../../controllers/authController";
import { authenticate } from "../../middlewares/authMiddleware";
import { FastifyPluginAsync } from "fastify";

const authRouter: FastifyPluginAsync = async (app: any) => {
  // Public routes
  app.post("/register", register);
  app.post("/login", login);
  app.post("/refresh-token", refreshToken);

  // Passwordless magic link
  app.post("/magic", passless);
  app.get("/magic/verify", passlessVerify);

  // Test magic link (dev only)
  app.post("/test/magic", testPassless);
  app.get("/test/magic/verify", testPasslessVerify);

  // Google OAuth
  app.get("/google", googleLogin);
  app.get("/google/callback", googleCallback);

  // Protected routes
  app.post("/logout", { preHandler: [authenticate] }, logout);
  app.post("/change-password", { preHandler: [authenticate] }, changePassword);

  app.post("/totp/enable", { preHandler: [authenticate] }, enableTotp);
  app.post("/totp/verify", { preHandler: [authenticate] }, verifyTotp);
  app.post("/totp/disable", { preHandler: [authenticate] }, disableTotp);
};

export default authRouter;
