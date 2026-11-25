import { Router } from "express";
import * as postController from "../controllers/postController.js";

const route = Router();
route.post("/add", postController.addPost);
export default route;