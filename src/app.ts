import type { Request, Response } from "express";

import express from "express";
import logger from "#config/logger.ts";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "#routes/auth.routes.ts";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	morgan("combined", {
		stream: { write: (message) => logger.info(message.trim()) },
	}),
);

app.get("/", (req: Request, res: Response) => {
	res.send("<h1>Hello from Acquisitions!</h1>");
});

app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

app.get("/api", (req, res) => {
	res.status(200).json({
		message: "Acquisitions API is running...",
	});
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
	res.status(404).send("<h1>404: Route not found!</h1>");
});

export default app;
