import { AppDataSource } from "../connection/data-source";
import { Admin } from "../entity/Admin";
import { CampaignWorker } from "../entity/CampaignWorker";
import { Event } from "../entity/Event";
import { Gallery } from "../entity/Gallery";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { Setting } from "../entity/Setting";

export class AdminService {
    private eventRepository = AppDataSource.getRepository(Event);
    private workerRepository = AppDataSource.getRepository(CampaignWorker);
    private galleryRepository = AppDataSource.getRepository(Gallery);
    private adminRepository = AppDataSource.getRepository(Admin);
    private settingRepository = AppDataSource.getRepository(Setting);

    async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
        if (!adminData.email) {
            throw new Error("Email is required to create an admin.");
        }

        const existingAdmin = await this.adminRepository.findOne({ where: { email: adminData.email } });
        if (existingAdmin) {
            throw new Error("An admin with this email already exists.");
        }

        const admin = this.adminRepository.create(adminData);
        return this.adminRepository.save(admin);
    }

    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const admin = await this.adminRepository.findOne({
            where: { email }
        });
        
        
        if (!admin) {
            return null;
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {            
            return null;
        }

        const accessToken = jwt.sign(
            { id: admin.id, role: "admin" },
            config.JWT_ACCESS_TOKEN!,
            { expiresIn: "15m" } // Short-lived access token
        );

        const refreshToken = jwt.sign(
            { id: admin.id, role: "admin" },
            config.JWT_REFRESH_TOKEN!,
            { expiresIn: "7d" } // Long-lived refresh token
        );

        admin.refreshToken = refreshToken;
        await this.adminRepository.save(admin);

       


        return { accessToken, refreshToken };
    }


    async refreshAccessToken(refreshToken: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN!) as { id: string, role: string };
            const admin = await this.adminRepository.findOneBy({ id: decoded.id, refreshToken });

            if (!admin) {
                return null;
            }

            const accessToken = jwt.sign(
                { id: admin.id, role: "admin" },
                config.JWT_ACCESS_TOKEN!,
                { expiresIn: "15m" }
            );

            return accessToken;
        } catch (error) {
            return null;
        }
    }

    async createEvent(eventData: Partial<Event>): Promise<Event> {
        const event = this.eventRepository.create(eventData);
        return this.eventRepository.save(event);
    }

    async createGalleryImage(imageData: Partial<Gallery>): Promise<Gallery> {
        const image = this.galleryRepository.create(imageData);
        return this.galleryRepository.save(image);
    }


    async getEventById(id: string): Promise<Event | null> {
        return this.eventRepository.findOne({
            where: { id },
            relations: ["registered_workers"]
        });
    }
    async getEventRegistrations(eventId: string): Promise<Event | null> {
        return this.eventRepository.findOne({
            where: { id: eventId },
            relations: ["registered_workers"],
        });
    }
    async getUsers(): Promise<CampaignWorker[]> {
        return this.workerRepository.find({
            order: { created_at: 'DESC' }
        });
    }

    async getUserById(userId: string): Promise<CampaignWorker | null> {
        return this.workerRepository.findOneBy({ id: userId });
    }

    async getDashboardSummary() {
        const recentUsers = await this.workerRepository.find({
            order: { created_at: 'DESC' },
            take: 3,
        });

        const recentEvents = await this.eventRepository.find({
            order: { created_at: 'DESC' },
            take: 3,
        });

        const totalMembers = await this.workerRepository.count();
        const totalEvents = await this.eventRepository.count();
        const totalGalleryItems = await this.galleryRepository.count();

        return { recentUsers, recentEvents, totalMembers, totalEvents, totalGalleryItems };
    }

    async logout(refreshToken: string): Promise<void> {
        const admin = await this.adminRepository.findOneBy({ refreshToken });
        if (admin) {
            // By using `update` here, we only change the refreshToken field.
            // This prevents the @BeforeUpdate hook in the Admin entity from running and re-hashing the password.
            await this.adminRepository.update(admin.id, { refreshToken: undefined });
        }
    }

    async getProfile(id: string) {
        return await this.adminRepository.findOne({ where: { id } });
    }

    async updateProfile(id: string, data: any) {
        await this.adminRepository.update(id, {
            name: data.name,
            email: data.email,
            phone: data.phone,
        });

        return this.getProfile(id);
    }


    async updatePassword(id: string, password: string) {
        return await this.adminRepository.update(id, { password });
    }

    async updateSettings(data: any) {
        // Fetch the list of settings. We expect it to have 0 or 1 items.
        const settingsList = await this.settingRepository.find();
        const existingSettings = settingsList.length > 0 ? settingsList[0] : null;

        if (existingSettings) {
            // If settings exist, update the record with the new data.
            await this.settingRepository.update(existingSettings.id, data);
            // Return the updated record.
            return await this.settingRepository.findOneBy({ id: existingSettings.id });
        } else {
            // If no settings exist, create a new record and save it.
            const newSettings = this.settingRepository.create(data);
            return await this.settingRepository.save(newSettings);
        }
    }
}