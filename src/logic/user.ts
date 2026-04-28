import { UserService } from "../service/userService";
import { Event } from "../entity/Event";
import { CampaignWorker } from "../entity/CampaignWorker";
import { Gallery } from "../entity/Gallery";

export class UserLogic {
  private userService = new UserService();

  async registerForEvent(email: string, eventId: string): Promise<Event> {
    return this.userService.registerForEvent(email, eventId);
  }

  async registerWorker(workerData: Partial<CampaignWorker>): Promise<CampaignWorker> {
    return this.userService.registerWorker(workerData);
  }

   async login(email: string, phoneNumber: string): Promise<string | null> {
    return this.userService.login(email, phoneNumber);
  }

  async getEvents(): Promise<Event[]> {
        return this.userService.getEvents();
  }

  async getGallery(): Promise<Gallery[]> {
        return this.userService.getGallery();
  }
}