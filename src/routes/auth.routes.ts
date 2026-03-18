import { signup } from "#controllers/auth.controller.ts";
import express from "express";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", async (req, res) => {
	res.send("Sign in");
});

router.post("/signout", async (req, res) => {
	res.send("Sign out");
});

export default router;
