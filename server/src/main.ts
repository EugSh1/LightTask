import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "dotenv/config";
import taskRouter from "./task/task.router.js";
import categoryRouter from "./category/category.router.js";
import authRouter from "./auth/auth.router.js";

const app = express();
const PORT = process.env.PORT || 4200;
const CLIENT_URL = process.env.NODE_ENV === "test" ? "*" : process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use("/task", taskRouter);
app.use("/category", categoryRouter);
app.use("/user", authRouter);

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`App started on port ${PORT}`);
    });
}

export default app;
