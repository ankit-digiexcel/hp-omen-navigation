import async_handler from "../middlewares/async.middleware.js";
import db_connection from "../models/index.js";
import ErrorResponse from "../utils/error.util.js";

export const entries = async_handler(async (req, res, next) => {
  const entries = await db_connection.omen_nav_model.findAll({});

  res.status(200).json({ success: true, data: entries });
});

export const saveEntry = async_handler(async (req, res, next) => {
  const { first_name, last_name, email, mobile, profession, state, city } =
    req.body;

  if (!first_name || !email || !mobile || !profession || !state || !city) {
    return next(new ErrorResponse(`Required fields are missing`, 200));
  }

  const existing_entry_with_email_and_mobile =
    await db_connection.omen_nav_model.count({
      where: { email, mobile },
    });

  if (existing_entry_with_email_and_mobile > 0) {
    return next(
      new ErrorResponse(`Already registered with this email and mobile`, 200)
    );
  }

  const existing_entry_with_email = await db_connection.omen_nav_model.count({
    where: { email },
  });
  if (existing_entry_with_email > 0) {
    return next(new ErrorResponse(`Already registered with this email`, 200));
  }

  const existing_entry_with_mobile = await db_connection.omen_nav_model.count({
    where: { mobile },
  });
  if (existing_entry_with_mobile > 0) {
    return next(new ErrorResponse(`Already registered with this mobile`, 200));
  }

  const entry = await db_connection.omen_nav_model.create({
    first_name,
    last_name,
    email,
    mobile,
    profession,
    state,
    city,
  });

  res.status(200).json({ success: true, data: entry });
});
