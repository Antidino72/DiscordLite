import { Router, type Request, type Response } from "express";
import {hash} from 'bcrypt';
import { Queries } from "../db/queries.js";
const route = Router();
const queries = new Queries()
const salt   = 2

route.post("/signup", async (req: Request, res: Response) => {
    const {username, password, image} = req.body
    console.log(req.body)
    if (!username || !password) {
        return res.status(400).json({
            error: "BAD Parameters",
            message: "Invalid request parameters",
        })
    }
    
    const hashedPassword = await hash('monMotDePasse', salt );

    const response = await queries.insertUser(
        username,
        hashedPassword,
        image
    )
    res.status(200).json(
        JSON.stringify(response)
    )


   
});
route.get("/me", (req: Request, res: Response) => {

    return res.status(401).json({
        success: false,
        logged: false,
        error: "Not authenticated"
    });
});
export default route