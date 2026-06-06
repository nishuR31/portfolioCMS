// src/routes/v1/adminRoutes.ts
import { FastifyPluginAsync } from "fastify";
import { requestDeleteAll, confirmDeleteAll } from "../../controllers/deleteAllController.js";

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/delete-all/request", requestDeleteAll);
  fastify.post("/delete-all/confirm", confirmDeleteAll);
};

export default adminRoutes;
