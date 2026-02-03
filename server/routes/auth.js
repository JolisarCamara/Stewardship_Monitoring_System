// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
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

// Register - New users are always created as regular users (role_id = 1)
router.post("/register-scholar", protect, hasRole("admin", "super-admin"), async (req, res) => {
  const client = await pool.connect();

  try {
    const { 
      name, email, password, 
      student_id, course, year_level, 
      designation, committed_day, committed_time, 
      required_stewardship_hours, counterpart, coordinator,
      placement_id // This links the scholar to the admins_role table
    } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password || !student_id || !placement_id) {
      return res.status(400).json({ message: "Missing required fields (Name, Email, Password, Student ID, and Placement)" });
    }

    // 2. Check if user already exists
    const userExists = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // START TRANSACTION
    await client.query('BEGIN');

    // 3. Hash Password and Insert User (Role 1 = User/Scholar)
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, 1) 
       RETURNING id`,
      [name, email, hashedPassword]
    );

    const newUserId = userResult.rows[0].id;

    // 4. Insert into scholar_profiles
    await client.query(
      `INSERT INTO scholar_profiles (
        user_id, student_id, course, year_level, 
        designation, committed_day, committed_time, 
        required_stewardship_hours, counterpart, coordinator,
        placement_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        newUserId, student_id, course, year_level, 
        designation, committed_day, committed_time, 
        required_stewardship_hours, counterpart, coordinator,
        placement_id
      ]
    );

    // COMMIT TRANSACTION
    await client.query('COMMIT');

    // 5. Fetch combined data to return to frontend
    const fullScholarData = await client.query(
      `SELECT u.id, u.name, u.email, s.*, ar.coordinator_placement as placement_name
       FROM users u 
       JOIN scholar_profiles s ON u.id = s.user_id
       LEFT JOIN admins_role ar ON s.placement_id = ar.placement_id
       WHERE u.id = $1`,
      [newUserId]
    );

    return res.status(201).json({ 
      message: "Scholar registered successfully",
      scholar: fullScholarData.rows[0] 
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Scholar Registration Error:", error);
    res.status(500).json({ message: "Server error during scholar registration" });
  } finally {
    client.release();
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