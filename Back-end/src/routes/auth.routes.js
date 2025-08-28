import { Router } from "express";
import {
  loginController, registerController,
  refreshController, logoutController, getMeController
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerController);
router.post("/login",    loginController);
router.post("/refresh",  refreshController);
router.post("/logout",   logoutController);
router.get("/me",        auth, getMeController);

export default router;
