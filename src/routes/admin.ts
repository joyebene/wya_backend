import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import upload from "../config/multer";
import { authenticateJWT, authorizeRole } from "../middleware/auth";
import { UserController } from "../controllers/userController";

const adminRouter = Router();
const adminController = new AdminController();
const userController = new UserController();

// Public routes
adminRouter.post("/register", adminController.createAdmin);
adminRouter.post("/login", adminController.login);
adminRouter.post("/refresh-token", adminController.refreshToken);
adminRouter.post("/logout", adminController.logout);

// Protected admin routes
adminRouter.get("/me", authenticateJWT, authorizeRole("admin"), adminController.getProfile);
adminRouter.put("/me", authenticateJWT, authorizeRole("admin"), adminController.updateProfile);

adminRouter.put("/change-password", authenticateJWT, authorizeRole("admin"), adminController.changePassword);

adminRouter.post(
    "/events",
    authenticateJWT,
    authorizeRole("admin"),
    upload.single("image"),
    adminController.createEvent
);
adminRouter.get("/events", authenticateJWT, authorizeRole("admin"), userController.getEvents);
adminRouter.get(
    "/events/:id",
    authenticateJWT,
    authorizeRole("admin"),
    adminController.getEventById
);
adminRouter.get(
    "/events/:id/registrations",
    authenticateJWT,
    authorizeRole("admin"),
    adminController.getEventRegistrations
);
adminRouter.get("/users", authenticateJWT, authorizeRole("admin"), adminController.getUsers);
adminRouter.get(
    "/users/:id",
    authenticateJWT,
    authorizeRole("admin"),
    adminController.getUserById
);
adminRouter.post(
    "/gallery",
    authenticateJWT,
    authorizeRole("admin"),
    upload.single("image"),
    adminController.uploadGalleryImage
);
adminRouter.get("/gallery", authenticateJWT, authorizeRole("admin"), userController.getGallery);
adminRouter.get(
    "/dashboard-summary",
    authenticateJWT,
    authorizeRole("admin"),
    adminController.getDashboardSummary
);


adminRouter.put("/settings", authenticateJWT, authorizeRole("admin"), adminController.updateSettings);

export default adminRouter;