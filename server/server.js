import express from "express";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";
import fileUpload from "express-fileupload";
import router from "./src/routes/index.routes.js";
import { error_handler } from "./src/middlewares/error.middleware.js";

/* configuring .env via dotenv */
dotenv.config();

// CORS configuration
const cors_opts = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "FETCH"],
  allowedHeaders: ["Content-Type", "authorization", "x-cscapi-key"],
};

// Initializing main express app
const app = express();

// Using funtional middlewares
app.use(cors(cors_opts));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(fileUpload());

// Static Path [serving build application inside the backend]
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../website/dist/website")));

// Registering Index router
app.use("/api/v1/", router);

// Default route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../website/dist/website/index.html"));
});

// errorHandler middleware
app.use(error_handler);

// Express Server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `app running on port [${port}] | http://localhost:${port}`
  );
});
