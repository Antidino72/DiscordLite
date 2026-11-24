import { hash, compare } from "bcrypt";
import { Queries } from "../db/queries.js";
import { signToken } from "../middlewares/auth.js";

const SALT_ROUNDS = 10;
const queries = new Queries();

export class UsernameTakenError extends Error {}
export class InvalidCredentialsError extends Error {}

function isUniqueViolation(err: unknown): boolean {
    return (err as { code?: string })?.code === "23505";
}

export async function signup(username: string, password: string, image?: string) {
    const existing = await queries.getUserByUsername(username);
    if (existing) throw new UsernameTakenError();

    const passwordHash = await hash(password, SALT_ROUNDS);

    let user;
    try {
        user = await queries.insertUser(username, passwordHash, image ?? null);
    } catch (err) {
        // Deux inscriptions simultanées : la contrainte UNIQUE tranche
        if (isUniqueViolation(err)) throw new UsernameTakenError();
        throw err;
    }

    return {
        token: signToken(user.public_id),
        user: { id: user.public_id, username: user.username },
    };
}

export async function login(username: string, password: string) {
    const user = await queries.getUserByUsername(username);

    // Même erreur si l'utilisateur n'existe pas ou si le mot de passe est faux
    if (!user || !(await compare(password, user.password_hash))) {
        throw new InvalidCredentialsError();
    }

    return {
        token: signToken(user.public_id),
        user: { id: user.public_id, username: user.username },
    };
}

export async function getCurrentUser(publicId: string) {
    const user = await queries.getUserByPublicId(publicId);
    if (!user) return null;
    return { id: user.public_id, username: user.username, image_url: user.image_url };
}