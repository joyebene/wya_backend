import { Request, Response } from "express";
import { AdminLogic } from "../logic/admin";
import { AdminService } from "../service/adminService";
import { AuthRequest } from "../types/express";

export class AdminController {
    private adminLogic = new AdminLogic();
    private adminService = new AdminService();

    getProfile = async (req: AuthRequest, res: Response) => {
        const admin = await this.adminService.getProfile(req.user?.id as string);
        if (admin) {
            res.json({
                email: admin.email,
                phone: admin.phone,
                name: admin.name,
            });
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    };

    updateProfile = async (req: AuthRequest, res: Response) => {
        const updated = await this.adminService.updateProfile(req.user?.id as string, req.body);
        if (!updated) return res.status(404).json({ message: "Admin not found" });
        res.json({
            email: updated.email,
            phone: updated.phone,
            name: updated.name,
        });
    };

    changePassword = async (req: AuthRequest, res: Response) => {
        const { currentPassword, newPassword } = req.body;

        await this.adminLogic.changePassword(req.user?.id as string, currentPassword, newPassword);

        res.json({ message: "Password updated successfully" });
    };

    createEvent = async (req: Request, res: Response) => {
        const event = await this.adminLogic.createEvent(req.body, req.file);
        res.status(201).json(event);
    };


    getEventRegistrations = async (req: Request, res: Response) => {
        const registrations = await this.adminLogic.getEventRegistrations(req.params.id as string);
        res.json(registrations);
    };

    getUsers = async (req: Request, res: Response) => {
        const users = await this.adminLogic.getUsers();
        res.json(users);
    };

    getUserById = async (req: Request, res: Response) => {
        const user = await this.adminLogic.getUserById(req.params.id as string);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    };

    uploadGalleryImage = async (req: Request, res: Response) => {
        const { title, category } = req.body;
        const image = await this.adminLogic.createGalleryImage(req.file!, title, category);
        res.status(201).json(image);
    };

    getDashboardSummary = async (req: Request, res: Response) => {
        const summary = await this.adminLogic.getDashboardSummary();
        res.json(summary);
    };

    createAdmin = async (req: Request, res: Response) => {
        try {
            const admin = await this.adminLogic.createAdmin(req.body);
            res.status(201).json({ message: "Admin created successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const tokens = await this.adminLogic.login(email, password);

            if (!tokens) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Return tokens in the response body instead of cookies
            res.status(200).json({
                message: "Logged in successfully",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "An error occurred during login" });
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        // Expect refreshToken in the request body
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found in body" });
        }

        const newAccessToken = await this.adminLogic.refreshAccessToken(refreshToken);

        if (!newAccessToken) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        // Return the new access token in the response body
        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
        });
    };

    logout = async (req: Request, res: Response) => {
        // Expect refreshToken in the request body
        const { refreshToken } = req.body;
        if (refreshToken) {
            await this.adminLogic.logout(refreshToken);
        }
        // No need to clear cookies anymore
        res.status(200).json({ message: "Logged out successfully" });
    };

    updateSettings = async (req: Request, res: Response) => {
        const updated = await this.adminService.updateSettings(req.body);
        res.json(updated);
    };

    getEventById = async (req: Request, res: Response) => {
        const event = await this.adminLogic.getEventById(req.params.id as string);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    };

}