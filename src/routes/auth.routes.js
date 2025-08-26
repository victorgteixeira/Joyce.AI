import { Router } from "express";
import {
  loginController, registerController,
  refreshController, logoutController
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login",    loginController);
router.post("/refresh",  refreshController);
router.post("/logout",   logoutController);

export default router;
