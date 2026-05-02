import { AdminService } from "../service/adminService";
import { Event } from "../entity/Event";
import { CampaignWorker } from "../entity/CampaignWorker";
import { Gallery } from "../entity/Gallery";
import { uploadFilesToCloudinary } from "../utils/cloudinary";
import { Admin } from "../entity/Admin";
import bcrypt from "bcryptjs";

export class AdminLogic {
    private adminService = new AdminService();

    async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
        return this.adminService.createAdmin(adminData);
    }



    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        return this.adminService.login(email, password);
    }

    async refreshAccessToken(refreshToken: string): Promise<string | null> {
        return this.adminService.refreshAccessToken(refreshToken);
    }

    async createEvent(eventData: Partial<Event>, file?: Express.Multer.File): Promise<Event> {
        if (file) {
            const uploadedFiles = await uploadFilesToCloudinary([file], "image", "admin");
            const { cloudinaryId, url } = uploadedFiles[0];
            eventData.image_url = url;
            eventData.cloudinary_id = cloudinaryId;
        }
        return this.adminService.createEvent(eventData);
    }

    async getEventById(id: string) {
        return this.adminService.getEventById(id);
    }


    async getEventRegistrations(eventId: string): Promise<Event | null> {
        return this.adminService.getEventRegistrations(eventId);
    }

    async getUsers(): Promise<CampaignWorker[]> {
        return this.adminService.getUsers();
    }
    async getUserById(userId: string): Promise<CampaignWorker | null> {
        return this.adminService.getUserById(userId);
    }

    async deleteUser(userId: string): Promise<void> {
        return this.adminService.deleteUser(userId);
    }

    getDashboardSummary = async () => {
        return await this.adminService.getDashboardSummary();
    };

    async createGalleryImage(file: Express.Multer.File, title?: string, category?: string): Promise<Gallery> {
        const uploadedFiles = await uploadFilesToCloudinary([file], "image", "admin");
        const { cloudinaryId, url } = uploadedFiles[0];
        return this.adminService.createGalleryImage({ title, category, image_url: url, cloudinary_id: cloudinaryId });
    }


    logout = async (refreshToken: string) => {
        return await this.adminService.logout(refreshToken);
    };

    async changePassword(id: string, current: string, next: string) {

        // 1. Get admin
        const admin = await this.adminService.getProfile(id);

        if (!admin) {
            throw new Error("Admin not found");
        }

        // 2. Validate current password
        const isMatch = await admin.comparePassword(current);

        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }

        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(next, 10);

        // 4. Update password
        await this.adminService.updatePassword(id, hashedPassword);
    }
}