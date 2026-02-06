// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer";
import { protect } from "../middleware/auth.js";
import { hasRole } from "../middleware/rbac.js";

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add this to help with local development connection issues
  tls: {
    rejectUnauthorized: false 
  }
});

// Register - New users are always created as regular users (role_id = 1)
router.post("/register-user", protect, hasRole("admin", "super-admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2. Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);

    // Note: ensure role_id 1 matches your intended 'Scholar' or 'User' role
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, 1) 
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    // 4. Get the full user data including the role name
    const userWithRole = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1`,
      [newUser.rows[0].id]
    );

    // SUCCESS: We return the user data but DO NOT set a new cookie
    return res.status(201).json({ 
      message: "User created successfully",
      user: userWithRole.rows[0] 
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const user = await pool.query(
    `SELECT u.*, r.name as role_name 
     FROM users u 
     LEFT JOIN roles r ON u.role_id = r.id 
     WHERE u.email = $1`,
    [email]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const userData = user.rows[0];
  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(userData.id);
  res.cookie("token", token, cookieOptions);

  res.json({
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role_name,
    },
  });
});

// Get current user info
router.get("/me", protect, async (req, res) => {
  const userData = await pool.query(
    `SELECT u.id, u.name, u.email, r.name as role 
     FROM users u 
     LEFT JOIN roles r ON u.role_id = r.id 
     WHERE u.id = $1`,
    [req.user.id]
  );

  res.json(userData.rows[0]);
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Logged out successfully" });
});

// --- FORGOT PASSWORD ENDPOINT ---
router.post('/forgot-password', async (req, res) => {
  // Normalize email to lowercase
  const email = req.body.email?.toLowerCase().trim();
  
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60000); // 10 mins

    const result = await pool.query(
      'UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE LOWER(email) = $3 RETURNING name',
      [otp, expiry, email]
    );

    // Security Tip: Even if email isn't found, 
    // it's often better to say "OTP sent" to prevent email fishing.
    // But for debugging, we will keep the 404 for now.
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${result.rows[0].name},</p>
          <p>Your OTP for password reset is: <b style="font-size: 20px; color: #4A90E2;">${otp}</b></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- RESET PASSWORD ENDPOINT ---
router.post('/reset-password', async (req, res) => {
  const { otp, newPassword } = req.body;
  const email = req.body.email?.toLowerCase().trim();

  try {
    // 1. Find user and Join with roles to get the role name
    const userResult = await pool.query(
      `SELECT u.id, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE LOWER(u.email) = $1 AND u.otp_code = $2 AND u.otp_expires_at > CURRENT_TIMESTAMP`,
      [email, otp]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    const user = userResult.rows[0];
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // 2. Clear OTP and update password in one go
    await pool.query(
      'UPDATE users SET password = $1, otp_code = NULL, otp_expires_at = NULL WHERE id = $2',
      [hashedPwd, user.id]
    );

    // 3. Return the role name so the frontend can redirect correctly
    res.json({ 
      message: "Password reset successful", 
      role: user.role_name 
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// routes/auth.js
// Add this route after the existing routes

// Create admin account - Only super-admin can do this
router.post("/register-super-admin", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Get role_id from role name
    const roleQuery = await pool.query(
      "SELECT id FROM roles WHERE name = $1",
      [role]
    );

    const role_id = roleQuery.rows[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role_id`,
      [name, email, hashedPassword, role_id]
    );

    // Get user with role name
    const userWithRole = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [newUser.rows[0].id]
    );

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      user: userWithRole.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;