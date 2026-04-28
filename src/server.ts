import { createServer } from "http";
import { AppDataSource } from "./connection/data-source";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rootRoute } from "./routes/rootRoute";
import { allowedOrigins } from "./config";

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully");

    const app = express();
    const httpServer = createServer(app);

    // ====================== MIDDLEWARE ======================
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static("public"));

    // Improved CORS for localhost + credentials (cookies)
    app.use(
      cors({
        origin: (origin, callback) => {
          // TEMPORARY FIX: Hardcode the check to bypass module import issues
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          }
          // Add your production frontend URL here later
          else if (origin === "http://ibn.wadada.com") {
            callback(null, true);
          }
          else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,                    // MUST be true for cookies
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

  

    // ====================== ROUTES ======================
    app.get("/whoami", (_req: Request, res: Response) => {
      res.json({ message: "Wadada Youth Ambassador API" });
    });

    app.use("/api/v1", rootRoute);

    app.use((_req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    // Start server
    const PORT = Number(process.env.PORT) || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });