import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { entries, saveEntry } from "../controllers/omen_nav.controller.js";

const omen_nav_router = express.Router();

omen_nav_router.route("/").get(protect, entries).post(saveEntry);
export default omen_nav_router;
