import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";

// Get user preferences
router.get("/preferences/:userId", userController.getPreferences);

// Update user preferences
router.put("/preferences/:userId", userController.updatePreferences);

router.post("/favourites/:userId", userController.addFavourite);

export default router;
