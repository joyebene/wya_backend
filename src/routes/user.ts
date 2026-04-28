import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registerWorker);
userRouter.post("/login", userController.login);
userRouter.post("/events/:eventId/register", userController.registerForEvent);

userRouter.get("/gallery", userController.getGallery);
userRouter.get("/events", userController.getEvents);
userRouter.get("/settings", userController.getSettings);

export default userRouter;