import express from "express";
import { createAdmin, login } from "../controllers/admin.crontroller.js";
import { protect } from "../middlewares/auth.middleware.js";

const admin_router = express.Router();

admin_router.route("/").post(protect, createAdmin);
admin_router.route("/login").post(login);
export default admin_router;
