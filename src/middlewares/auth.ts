import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Lu à l'exécution, pas au chargement du module (dotenv doit être déjà chargé)
function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    return secret;
}

export function signToken(publicId: string): string {
    return jwt.sign({ sub: publicId }, getSecret(), { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const payload = jwt.verify(header.slice(7), getSecret()) as { sub: string };
        res.locals.userPublicId = payload.sub;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}