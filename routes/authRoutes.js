import express from "express";
import { register, login } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);

export default router;
