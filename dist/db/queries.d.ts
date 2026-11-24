import type { User } from "../types/user.js";
export declare class Queries {
    insertUser(username: string, password: string, image: string | null): Promise<User>;
    getUserByUsername(username: string): Promise<{
        id: number;
        username: string;
        password_hash: string;
    } | undefined>;
    insertMessage(userId: any, username: any, userImage: any, content: any): Promise<string>;
    getMessagesBeforeID(id: any, limit: any): Promise<any[]>;
    getMessagesAfterID(id: any, limit: any): Promise<any[]>;
    getMessages(limit: any): Promise<any[]>;
    updateUserStatus(state: any): Promise<any[]>;
    getUserList(): Promise<any[]>;
}
//# sourceMappingURL=queries.d.ts.map