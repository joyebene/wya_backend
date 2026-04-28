import { config } from "../config";
import { AppDataSource } from "../connection/data-source";
import { CampaignWorker } from "../entity/CampaignWorker";
import { Event } from "../entity/Event";
import jwt from "jsonwebtoken";
import { Gallery } from "../entity/Gallery";
import { Setting } from "../entity/Setting";

export class UserService {
  private eventRepository = AppDataSource.getRepository(Event);
  private workerRepository = AppDataSource.getRepository(CampaignWorker);
  private galleryRepository = AppDataSource.getRepository(Gallery);
   private settingRepository = AppDataSource.getRepository(Setting);

  async registerForEvent(email: string, eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ["registered_workers"]
    });
    if (!event) {
      throw new Error("Event not found");
    }

    const worker = await this.workerRepository.findOneBy({ email: email });
    if (!worker) {
      throw new Error("You must be a member of the campaign to register for events");
    }

    const isAlreadyRegistered = event.registered_workers.some(w => w.email === worker.email);
    if (isAlreadyRegistered) {
      throw new Error("Worker is already registered for this event");
    }

    event.registered_workers.push(worker);
    return this.eventRepository.save(event);
  }

  async registerWorker(workerData: Partial<CampaignWorker>): Promise<CampaignWorker> {
    const { phone_number, email } = workerData;
    if (!phone_number || !email) {
      throw new Error("Phone number and email is required");
    }

    const existingWorkerEmail = await this.workerRepository.findOneBy({ email });
    if (existingWorkerEmail) {
      throw new Error("A worker with this email is already registered");
    }

    const existingWorkerPhone = await this.workerRepository.findOneBy({ phone_number });
    if (existingWorkerPhone) {
      throw new Error("A worker with this phone number is already registered");
    }

    const newWorker = this.workerRepository.create(workerData);
    return this.workerRepository.save(newWorker);
  }

    async login(email: string, phoneNumber: string): Promise<string | null> {
    const worker = await this.workerRepository.findOneBy({
      email: email,
      phone_number: phoneNumber,
    });
 
    if (!worker) {
      return null; // Credentials don't match
    }
 
    // Generate JWT
    const token = jwt.sign(
      { id: worker.id, role: "worker" },
      config.JWT_ACCESS_TOKEN!,
      { expiresIn: "1d" }
    );
 
    return token;
  }

    async getEvents(): Promise<Event[]> {
        return this.eventRepository.find({
          order: {created_at: "DESC"}
        });
    }

      async getGallery(): Promise<Gallery[]> {
        return this.galleryRepository.find({
          order: { created_at: "DESC"}
        });
    }

    async getSettings() {
    return await this.settingRepository.findOne({ where: {} });
}

}
