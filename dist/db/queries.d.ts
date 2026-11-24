import type { User } from "../types/user.js";
export declare class Queries {
    insertUser(username: string, password: string, image: string | null): Promise<User>;
    getUserByUsername(username: string): Promise<User | undefined>;
    insertMessage(userId: any, username: any, userImage: any, content: any): Promise<string>;
    getUserByPublicId(publicId: string): Promise<User | undefined>;
    getMessagesBeforeID(id: any, limit: any): Promise<any[]>;
    getMessagesAfterID(id: any, limit: any): Promise<any[]>;
    getMessages(limit: any): Promise<any[]>;
    updateUserStatus(state: any): Promise<any[]>;
    getUserList(): Promise<any[]>;
}
//# sourceMappingURL=queries.d.ts.map