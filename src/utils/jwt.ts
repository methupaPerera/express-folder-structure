import logger from "#config/logger.ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "77dcd09f1ee04d31b37b0b7930cb67ad";
const JWT_EXPIRES_IN = "1d";

export const jwttoken = {
	sign: (payload: Record<string, any>) => {
		try {
			return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
		} catch (error) {
			logger.error("Failed to authenticate token:", error);
			throw new Error("Failed to authenticate token");
		}
	},
	verify: (token: string) => {
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (error) {
			logger.error("Failed to authenticate token:", error);
			throw new Error("Failed to authenticate token");
		}
	},
};
