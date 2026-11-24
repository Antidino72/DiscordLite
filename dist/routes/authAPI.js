import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as authController from "../controllers/authController.js";
const route = Router();
route.post("/signup", authController.signup);
route.post("/login", authController.login);
route.get("/me", requireAuth, authController.me);
export default route;
//# sourceMappingURL=authAPI.js.map