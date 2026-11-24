export declare class UsernameTakenError extends Error {
}
export declare class InvalidCredentialsError extends Error {
}
export declare function signup(username: string, password: string, image?: string): Promise<{
    token: string;
    user: {
        id: string;
        username: string;
    };
}>;
export declare function login(username: string, password: string): Promise<{
    token: string;
    user: {
        id: string;
        username: string;
    };
}>;
export declare function getCurrentUser(publicId: string): Promise<{
    id: string;
    username: string;
    image_url: string | null;
} | null>;
//# sourceMappingURL=authService.d.ts.map