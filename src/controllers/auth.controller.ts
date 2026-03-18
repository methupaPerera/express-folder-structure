import type { NextFunction, Request, Response } from "express";
import logger from "#config/logger.ts";
import { signupSchema } from "#validations/auth.validation.ts";
import { formatValidationError } from "#utils/format.ts";
import { createUser } from "#services/auth.service.ts";
import { jwttoken } from "#utils/jwt.ts";
import { cookies } from "#utils/cookies.ts";

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validationResult = signupSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation Failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { name, email, password, role } = validationResult.data;
		const user = await createUser({ name, email, password, role });
		const token = jwttoken.sign({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		cookies.set(res, "token", token);

		logger.info("User registered successfully : " + user.email);
		res.status(201).json({
			message: "User Registered",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				created_at: user.created_at,
			},
		});
	} catch (error) {
		logger.error("Sign up error : " + error);

		return res.status(400).json({
			error: "Sign up Failed",
			details: {
				message: (error as Error).message,
			},
		});
	}
};
