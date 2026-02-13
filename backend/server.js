import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import router from "./router.js";
const app = express();
const port = 8080;

app.use(express.json());
app.use(loggerMiddleware);

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});