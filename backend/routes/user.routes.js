import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar)

export default router;