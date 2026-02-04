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
router.get("/", protect, hasRole("super-admin"), async (req, res) => {
  try {
    let query = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
    `;

    query += " ORDER BY u.created_at DESC";

    const users = await pool.query(query);
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/users.js
router.get("/stats", protect, hasRole("super-admin"), async (req, res) => {
  try {
    const totalScholars = await pool.query(
      `SELECT COUNT(*) 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE r.name = 'user'`
    );

    const totalAdmins = await pool.query(
      `SELECT COUNT(*) 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE r.name = 'admin'`
    );

    const totalSuperAdmins = await pool.query(
      `SELECT COUNT(*) 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE r.name = 'super-admin'`
    );

    res.json({
      totalScholars: Number(totalScholars.rows[0].count),
      totalAdmins: Number(totalAdmins.rows[0].count),
      totalSuperAdmins: Number(totalSuperAdmins.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/scholar-accounts", protect, hasRole("admin", "super-admin"), async (req, res) => {
  try {
    let query = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role_id = 1
    `;

    query += " ORDER BY u.created_at DESC";

    const users = await pool.query(query);
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/super-admin-accounts", protect, hasRole("admin", "super-admin"), async (req, res) => {
  try {
    let query = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role_id = 3
    `;

    query += " ORDER BY u.created_at DESC";

    const users = await pool.query(query);
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin-accounts", protect, hasRole("super-admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        r.name AS role_name,
        ar.coordinator_placement,
        ar.description AS placement_description,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN admin_profiles ap ON u.id = ap.user_id
      JOIN admins_role ar ON ap.placement_id = ar.placement_id
      WHERE r.name = 'admin' OR r.name = 'super-admin'
      ORDER BY u.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching admins" });
  }
});

// GET all available coordinator placements
router.get("/admin-placements", protect, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT placement_id, coordinator_placement FROM admins_role ORDER BY coordinator_placement ASC"
    );
    
    // Return the rows directly so the frontend can map through them
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).json({ message: "Server error fetching placement areas" });
  }
});

// Create admin account - Only super-admin can do this
router.post("/create-admin", protect, hasRole("super-admin"), async (req, res) => {
  const client = await pool.connect();

  try {
    // Now accepting 'coordinator_placement' name or 'placement_id'
    const { name, email, password, role, coordinator_placement } = req.body;

    if (!name || !email || !password || !role || !coordinator_placement) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    await client.query('BEGIN');

    // 1. Get the placement_id from the string name provided
    const placementQuery = await client.query(
      "SELECT placement_id FROM admins_role WHERE coordinator_placement = $1",
      [coordinator_placement]
    );

    if (placementQuery.rows.length === 0) {
      throw new Error("INVALID_PLACEMENT");
    }
    const placement_id = placementQuery.rows[0].placement_id;

    // 2. Map Role
    const roleQuery = await client.query("SELECT id FROM roles WHERE name = $1", [role]);
    if (roleQuery.rows.length === 0) {
      throw new Error("INVALID_ROLE");
    }
    const role_id = roleQuery.rows[0].id;

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into users
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role_id) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
      [name, email, hashedPassword, role_id]
    );
    const newUserId = userResult.rows[0].id;

    // 5. Insert into admin_profiles
    await client.query(
      `INSERT INTO admin_profiles (user_id, placement_id) VALUES ($1, $2)`,
      [newUserId, placement_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        ...userResult.rows[0],
        coordinator_placement // Echo back the placement name
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    
    if (error.message === "INVALID_PLACEMENT") {
      return res.status(400).json({ message: "The specified coordinator placement does not exist." });
    }
    if (error.message === "INVALID_ROLE") {
      return res.status(400).json({ message: "Invalid Role" });
    }
    // ... other error checks (23505, etc.)
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
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
router.put("/update-admin/:id", protect, hasRole("super-admin"), async (req, res) => {
  const { id } = req.params;
  const { name, email, coordinator_placement } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update Users Table
    await client.query(
      "UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      [name, email, id]
    );

    // Find the ID for the string placement name
    const placementRes = await client.query(
      "SELECT placement_id FROM admins_role WHERE coordinator_placement = $1",
      [coordinator_placement]
    );

    if (placementRes.rows.length === 0) {
      throw new Error("Placement not found");
    }

    const p_id = placementRes.rows[0].placement_id;

    // Update Admin Profile Table
    await client.query(
      "UPDATE admin_profiles SET placement_id = $1 WHERE user_id = $2",
      [p_id, id]
    );

    await client.query('COMMIT');
    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: "Server error during update" });
  } finally {
    client.release();
  }
});

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