import express from "express";
const router = express.Router();

import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import profileRoute from "./routes/profile.js";
import preferencesRoute from "./routes/preferences.js";
import reviewsRoute from "./routes/reviews.js";
import aiRoute from "./routes/ai.js";

router.use("/signup", signupRoute);
router.use("/login", loginRoute);
router.use("/profile", profileRoute);
router.use("/preferences", preferencesRoute);
router.use("/reviews", reviewsRoute);
router.use("/ai", aiRoute);

export default router;
