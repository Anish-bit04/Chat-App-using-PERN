import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string;
            };
        }
    }
}

interface DecodedToken extends JwtPayload{
    userId:string
}

const protectRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: "'Unauthorized'- No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        });

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

       req.user = user

        next();
    } catch (error: any) {
        return res.status(400).json({ error: "Internal Server Error" });
    }
};

export default protectRoute;
