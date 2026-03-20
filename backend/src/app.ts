import "reflect-metadata";
import "express-async-errors";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import postRoutes from "./modules/posts/posts.routes";
import categoryRoutes from "./modules/categories/categories.routes";
import usersRoutes from "./modules/users/users.routes";
import uploadRoutes from "./modules/uploads/uploads.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
const allowedOrigins = env.corsOrigin.split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  }
}));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API is running", status: "ok", docs: "/api/docs" });
});

app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "API is running", status: "ok" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: `Route ${_req.url} not found` });
});

app.use(errorMiddleware);

const startServer = async (retries = 5, delay = 3000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      app.listen(env.port, () => {
        console.log(`API running on port ${env.port}`);
      });
      return;
    } catch (error: unknown) {
      console.error(`Database connection attempt ${i + 1}/${retries} failed (host: ${env.db.host}):`, error instanceof Error ? error.message : error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  console.error("Could not connect to database after all retries. Exiting.");
  process.exit(1);
};

const isVercel = process.env.VERCEL === "1";

if (!isVercel) {
  startServer();
}

export default app;
