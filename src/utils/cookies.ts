import type { Request, Response, CookieOptions } from "express";

export const cookies = {
	getOptions: (): CookieOptions => ({
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	}),

	get: (req: Request, name: string) => {
		return req.cookies[name];
	},

	set: (
		res: Response,
		name: string,
		value: string,
		options: CookieOptions = {},
	) => {
		res.cookie(name, value, { ...cookies.getOptions(), ...options });
	},
};
