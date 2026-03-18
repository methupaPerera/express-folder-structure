import type { ZodError } from "zod";

export const formatValidationError = (error: ZodError) => {
	const formatted: Record<string, string> = {};

	for (const issue of error.issues) {
		const field = String(issue.path[0]);
		formatted[field] = issue.message;
	}

	return formatted;
};
