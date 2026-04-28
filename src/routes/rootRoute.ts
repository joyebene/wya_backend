import { Router } from "express";
import adminRouter from "./admin";
import userRouter from "./user";

export const rootRoute = Router();

rootRoute.use("/admin", adminRouter);
rootRoute.use("/users", userRouter);