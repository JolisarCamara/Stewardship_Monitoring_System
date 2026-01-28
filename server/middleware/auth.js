// middleware/auth.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await pool.query(
      `SELECT u.id, u.name, u.email, u.role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};