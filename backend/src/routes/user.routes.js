
import { Router } from "express";

import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateToken);

router.get("/me", getMyProfile);

router.put(
  "/me",
  upload.single("avatar"),
  updateMyProfile
);

export default router;
