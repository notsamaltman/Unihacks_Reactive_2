import express from "express";
const router = express.Router();

import signupRoutes from "./routes/signup.js";
import loginRoutes from "./routes/login.js";

router.use("/", signupRoutes);
router.use("/", loginRoutes);

export default router;
