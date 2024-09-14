import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: "'Unauthorized'- No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(400).json({ error: "Internal Server Error" });
    }
};
export default protectRoute;
