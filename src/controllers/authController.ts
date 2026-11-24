import type { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { UsernameTakenError, InvalidCredentialsError } from "../services/authService.js";

function badRequest(res: Response) {
    return res.status(400).json({
        error: "BAD Parameters",
        message: "Invalid request parameters",
    });
}

export async function signup(req: Request, res: Response) {
    const { username, password, image } = req.body ?? {};
    if (!username || !password) return badRequest(res);

    try {
        const result = await authService.signup(username, password, image);
        return res.status(200).json(result);
    } catch (err) {
        if (err instanceof UsernameTakenError) {
            return res.status(409).json({ message: "A username must be unique" });
        }
        throw err; // Attrapé par le gestionnaire d'erreurs global
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body ?? {};
    if (!username || !password) return badRequest(res);

    try {
        const result = await authService.login(username, password);
        return res.status(200).json(result);
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Identifiants invalides",
            });
        }
        throw err;
    }
}

export async function me(req: Request, res: Response) {
    const user = await authService.getCurrentUser(res.locals.userPublicId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
}