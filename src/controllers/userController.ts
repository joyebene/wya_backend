import { Request, Response } from "express";
import { UserLogic } from "../logic/user";
import { UserService } from "../service/userService";

export class UserController {
  private userLogic = new UserLogic();
  private userService = new UserService();

  registerForEvent = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      // In a real application, the worker's ID would come from an
      // authenticated session, not the request body.
      const { workerEmail } = req.body;

      if (!workerEmail) {
        return res.status(400).json({ message: "worker Email is required" });
      }

      const event = await this.userLogic.registerForEvent(workerEmail, eventId as string);
      res.status(200).json({ message: "Successfully registered for event", event });
    } catch (error: any) {
      // A more robust error handling middleware would be better here
      res.status(400).json({ message: error.message });
    }
  };

  registerWorker = async (req: Request, res: Response) => {
    try {
      const worker = await this.userLogic.registerWorker(req.body);
      res.status(201).json({ message: "Worker registered successfully", worker });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, phone_number } = req.body;
      if (!email || !phone_number) {
        return res.status(400).json({ message: "Email and phone number are required" });
      }

      const token = await this.userLogic.login(email, phone_number);

      if (!token) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({ message: "Logged in successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "An error occurred during login" });
    }
  };

  getEvents = async (req: Request, res: Response) => {
    const events = await this.userLogic.getEvents();
    res.json(events);
  };

  getGallery = async (req: Request, res: Response) => {
    const gallery = await this.userLogic.getGallery();
    res.json(gallery);
  };

  getSettings = async (req: Request, res: Response) => {
    const settings = await this.userService.getSettings();
    res.json(settings);
  };

}