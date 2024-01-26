import async_handler from "../middlewares/async.middleware.js";
import db_connection from "../models/index.js";
import {
  get_signed_token,
  hashed_password,
  match_password,
} from "../utils/auth.util.js";
import ErrorResponse from "../utils/error.util.js";

export const createAdmin = async_handler(async (req, res, next) => {
  const admin_user = await db_connection.admin_user_model.create({
    name: "Admin",
    email: "admin@hpspectrex360.com",
    password: await hashed_password("Asd123!@#"),
    role: "ADMIN",
  });

  res.status(200).json({ success: true, data: admin_user });
});

/**
 * Funtion to login
 */
export const login = async_handler(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await db_connection.admin_user_model.findOne({
    where: { email },
  });

  if (!admin) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const is_matched = await match_password(password, admin.password);

  if (!is_matched) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const token = get_signed_token(admin.admin_id);

  const admin_data = { ...admin, password: undefined };

  res.status(200).json({ success: true, data: { token, user: admin_data } });
});
