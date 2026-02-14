import "dotenv/config";
import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import router from "./router.js";
const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());
app.use(loggerMiddleware);

app.use('/api', router);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});