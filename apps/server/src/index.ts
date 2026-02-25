import "dotenv/config";
import express from "express";
import cors from "cors";
import insitesRouter from "./router/insites.router";
import teacherRouter from "./router/teacher.routes";
import authRouter from "./router/auth.router";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/insites", insitesRouter);


app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});