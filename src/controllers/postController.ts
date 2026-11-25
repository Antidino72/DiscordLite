import type { Request, Response } from "express";
import { badRequest } from "../services/ErrorService.js";
import * as postService from "../services/postService.js"
import { getCurrentUser } from "../services/authService.js";
export async function addPost(req: Request, res: Response) {
    const user = await getCurrentUser(res.locals.userPublicId);
    if (!user?.id) {
        return res.status(404).json({ error: "User not found" });
    }

    const { content } = req.body ?? {};
    if (!content) return badRequest(res);

    try {
        const result = await postService.addPost(user.id, content);
        return res.status(201).json(result);
    } catch (error) {
        console.error("addPost failed:", error);
        return res.status(500).json({ error: "Failed to create post" });
    }
}
