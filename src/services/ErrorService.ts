import type { Response } from "express";


export function badRequest(res: Response) {
    return res.status(400).json({
        error: "BAD Parameters",
        message: "Invalid request parameters",
    });
}