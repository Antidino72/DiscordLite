declare module "express-session" {
    interface SessionData {
        user?: {
            user_id: number;
            username: string;
            image?: string;
            email?: string;
        };
    }
}
export {};
//# sourceMappingURL=session.d.ts.map