import jwt from "jsonwebtoken";
import async_handler from "./async.middleware.js";
import db_connection from "../models/index.js";
import ErrorResponse from "../utils/error.util.js";

export const protect = async_handler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await db_connection.admin_user_model.findOne({
      where: { admin_id: decoded.id },
    });
    req.user = admin.dataValues;

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`${req.user.role} is not authorized`, 403));
    }
    next();
  };
};
