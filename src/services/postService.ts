import { Queries } from "../db/queries.js";
import type { POST } from "../types/post.js";

const queries = new Queries();



export async function addPost(user_id  : string , content : string) : Promise<POST> {
    return await queries.addPost(user_id,content)
}