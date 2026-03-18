import bcrypt from "bcrypt";
import logger from "#config/logger.ts";
import z from "zod";
import { signupSchema } from "#validations/auth.validation.ts";
import { db } from "#config/database.ts";
import { users } from "#models/user.model.ts";
import { eq } from "drizzle-orm";

export const hashPassword = async (password: string) => {
	try {
		return await bcrypt.hash(password, 10);
	} catch (error) {
		logger.error("Error hashing the password : " + error);
		throw new Error("Error hashing the password");
	}
};

export const createUser = async ({
	name,
	email,
	password,
	role = "user",
}: z.infer<typeof signupSchema>) => {
	try {
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			throw new Error("User already exists");
		}

		const hashedPassword = await hashPassword(password);

		const [newUser] = await db
			.insert(users)
			.values({ name, email, password: hashedPassword, role })
			.returning({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				created_at: users.created_at,
			});

		logger.info("User " + newUser.email + " created successsfully");

		return newUser;
	} catch (error) {
		logger.error("Error creating the user : " + error);
		throw error;
	}
};
