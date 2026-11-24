// middleware/auth.ts
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export function signToken(userId) {
    return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: "7d" });
}
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET);
        res.locals.userId = Number(payload.sub);
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
//# sourceMappingURL=auth.js.map