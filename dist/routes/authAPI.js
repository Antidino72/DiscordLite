import { Router } from "express";
import { hash, compare } from "bcrypt";
import { Queries } from "../db/queries.js";
import { signToken } from "../middlewares/auth.js";
const route = Router();
const queries = new Queries();
const SALT_ROUNDS = 10;
route.post("/signup", async (req, res) => {
    const { username, password, image } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            error: "BAD Parameters",
            message: "Invalid request parameters",
        });
    }
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const response = await queries.insertUser(username, hashedPassword, image);
    res.status(200).json({
        "token": signToken(response.id),
        "user_id": response.id,
        "username": response.username
    });
});
route.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            error: "BAD Parameters",
            message: "Invalid request parameters",
        });
    }
    // Récupère l'utilisateur par son nom uniquement
    const user = await queries.getUserByUsername(username);
    // Même message dans les deux cas pour ne pas révéler si le compte existe
    if (!user || !(await compare(password, user.password_hash))) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Identifiants invalides",
        });
    }
    res.status(200).json({ id: user.id, username: user.username });
});
route.get("/me", (req, res) => {
    return res.status(401).json({
        success: false,
        logged: false,
        error: "Not authenticated",
    });
});
export default route;
//# sourceMappingURL=authAPI.js.map