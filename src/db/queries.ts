import type { POST } from "../types/post.js";
import type { User } from "../types/user.js";
import {pool} from "./index.js"
export class Queries{

    // authentifiaction 
    async insertUser(username : string, password: string, image: string |null) :  Promise<User>{
        
        if (!image) {
            image = process.env.DEFAULT_USER_IMAGE 
                || "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
        }

        const final_image: string = image;
        const query = 'INSERT INTO users (username, password_hash, image_url) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [username, password, final_image]);
        return res.rows[0];
    }
    async getUserByUsername(username: string): Promise<User | undefined> {
        const query = 'SELECT id , public_id, username, password_hash FROM users WHERE username = $1 LIMIT 1';
        const res = await pool.query(query, [username]);
        return res.rows[0];
    }

    async getUserByPublicId(publicId: string): Promise<User | undefined> {
    const query = 'SELECT id, public_id, username, image_url FROM users WHERE public_id = $1 LIMIT 1';
    const res = await pool.query(query, [publicId]);
    return res.rows[0];
}

    // post 
    async addPost(user_id : string , content : string) : Promise<POST>{
        const query = 'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *';
        const res = await pool.query(query, [user_id, content]);
        return res.rows[0];
    }
    async getPostsByUUID(post_id : string) : Promise<POST>{
        const query = "SELECT * FROM posts WHERE id = ?";
        const res = await pool.query(query,[post_id])
        return res.rows[0]
    }
    async getPosts(limit?: number): Promise<POST[]> {
        const safeLimit = limit && limit > 0 ? Math.min(limit, 100) : 10;
        const query = "SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1";
        const res = await pool.query(query, [safeLimit]);
        return res.rows;
    }
}

