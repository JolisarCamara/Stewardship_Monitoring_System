// routes/users.js
import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";
import { hasRole, canManageUser, canViewUser, canChangeRole } from "../middleware/rbac.js";

const router = express.Router();

// Get all users
// Admin: can see only regular users (role_id = 1)
// Super-admin: can see everyone
router.get("/", protect, hasRole("admin", "super-admin"), async (req, res) => {
  try {
    let query = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
    `;

    // Admins can only see regular users
    if (req.user.role_name === "admin") {
      query += " WHERE u.role_id = 1";
    }

    query += " ORDER BY u.created_at DESC";

    const users = await pool.query(query);
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create admin account - Only super-admin can do this
router.post("/create-admin", protect, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Validate role
    const validRoles = ['admin', 'super-admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be 'admin' or 'super-admin'" 
      });
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

    if (roleQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

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

// Get single user
// User: can view own data
// Admin: can view user (role_id = 1) data
// Super-admin: can view anyone
router.get("/:id", protect, canViewUser, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.params.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user data (name, email)
// User: can update own data
// Admin: can update user (role_id = 1) data
// Super-admin: can update anyone's data
router.put("/:id", protect, canManageUser, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is already taken by another user
    const emailExists = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, req.params.id]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updatedUser = await pool.query(
      `UPDATE users SET name = $1, email = $2 
       WHERE id = $3 
       RETURNING id, name, email`,
      [name, email, req.params.id]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change password
// User: can change own password
// Admin: can change user (role_id = 1) password
// Super-admin: can change anyone's password
router.patch("/:id/password", protect, canManageUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // If user is changing their own password, verify current password
    if (parseInt(req.params.id) === req.user.id) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const user = await pool.query("SELECT password FROM users WHERE id = $1", [req.params.id]);
      const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, req.params.id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
// Admin: can delete users (role_id = 1)
// Super-admin: can delete anyone (except themselves for safety)
router.delete("/:id", protect, hasRole("admin", "super-admin"), canManageUser, async (req, res) => {
  try {
    // Prevent users from deleting themselves
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change user role - Only super-admin
router.patch("/:id/role", protect, canChangeRole, async (req, res) => {
  try {
    const { role_id } = req.body;

    if (![1, 2, 3].includes(role_id)) {
      return res.status(400).json({ message: "Invalid role. Must be 1 (user), 2 (admin), or 3 (super-admin)" });
    }

    // Prevent changing own role (for safety)
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const updatedUser = await pool.query(
      `UPDATE users SET role_id = $1 
       WHERE id = $2 
       RETURNING id, name, email, role_id`,
      [role_id, req.params.id]
    );

    const userWithRole = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.params.id]
    );

    res.json(userWithRole.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;