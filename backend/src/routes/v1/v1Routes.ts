// import { Router } from "express";
import authRouter from "./authRoutes";
import portfolioRouter from "./portfolioRoutes";
import { FastifyPluginAsync } from "fastify";

const v1Router: FastifyPluginAsync = async (app: any) => {
  app.register(authRouter, { prefix: "/auth" });
  app.register(portfolioRouter, { prefix: "/portfolio" });
};

export default v1Router;
