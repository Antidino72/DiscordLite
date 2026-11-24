import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(userId: number): string {
    return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as { sub: string };
        res.locals.userId = Number(payload.sub);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}