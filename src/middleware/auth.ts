import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";


// Extend the Express Request interface to include the user payload
interface AuthenticatedRequest extends Request {
    user?: any;
}


export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided or malformed header." });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }


    try {
        const decoded = jwt.verify(token, config.JWT_ACCESS_TOKEN!);
        req.user = decoded;
        next();
    } catch (error) {
        // If the access token is expired, this will throw an error
        // The frontend will catch the 401 and trigger the refresh flow
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};


export const authorizeRole = (role: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: "Forbidden. You do not have the required role." });
        }
        next();
    };
};