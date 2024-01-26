import express from "express";
import admin_router from "./admin.routes.js";
import omen_nav_router from "./omen_nav.routes.js";

const router = express.Router();

// health check route for v1
router.get("/healthcheck", (_, res) => res.sendStatus(200));
router.use("/omen_nav", omen_nav_router);
router.use("/admin", admin_router);

export default router;
