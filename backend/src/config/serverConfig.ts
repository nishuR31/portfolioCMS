import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

// let isDev = process.env.NODE_ENV === "dev";
const fastifyApp = fastify({
  logger: true,
  exposeHeadRoutes: true,
});

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL ?? "http://localhost:5173"
];

fastifyApp.register(cors, {
  origin: (origin, cb) => {
    // Allow same-origin (no origin) requests
    if (!origin) {
      cb(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

fastifyApp.register(cookie);

fastifyApp.get("/", (req, res) => {
  res.code(200).send({ message: "Server fired up" });
});

// app.setErrorHandler((err, req, res) => {
//   (err && res.log.error(err),
//     res.code(err?.statusCode || 500).send({
//       message: !isDev ? err?.message : "something broke",
//     }));
// });
export default fastifyApp;
