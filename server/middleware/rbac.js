// middleware/rbac.js
import pool from "../config/db.js";

// Check if user has specific role
export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = req.user.role_name;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}` 
      });
    }

    next();
  };
};

// Check if user can manage the target user
export const canManageUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.params.userId;
    const currentUser = req.user;

    // Get target user's role
    const targetUser = await pool.query(
      `SELECT u.id, u.role_id, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [targetUserId]
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const target = targetUser.rows[0];
    req.targetUser = target;

    // Super-admin can manage everyone
    if (currentUser.role_name === "super-admin") {
      return next();
    }

    // Admin can manage only users (role_id = 1), not other admins or super-admins
    if (currentUser.role_name === "admin") {
      if (target.role_id !== 1) {
        return res.status(403).json({ 
          message: "Admins can only manage regular users, not other admins or super-admins" 
        });
      }
      return next();
    }

    // Regular users can only manage themselves
    if (currentUser.role_name === "user") {
      if (parseInt(targetUserId) !== currentUser.id) {
        return res.status(403).json({ 
          message: "Users can only manage their own account" 
        });
      }
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if user can view target user's data
export const canViewUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.params.userId;
    const currentUser = req.user;

    // Super-admin can view everyone
    if (currentUser.role_name === "super-admin") {
      return next();
    }

    // Admin can view only users (role_id = 1)
    if (currentUser.role_name === "admin") {
      const targetUser = await pool.query(
        "SELECT role_id FROM users WHERE id = $1",
        [targetUserId]
      );

      if (targetUser.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (targetUser.rows[0].role_id !== 1) {
        return res.status(403).json({ 
          message: "Admins can only view regular users" 
        });
      }
      return next();
    }

    // Regular users can only view themselves
    if (currentUser.role_name === "user") {
      if (parseInt(targetUserId) !== currentUser.id) {
        return res.status(403).json({ 
          message: "Users can only view their own account" 
        });
      }
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Only super-admin can change roles
export const canChangeRole = (req, res, next) => {
  if (req.user.role_name !== "super-admin") {
    return res.status(403).json({ 
      message: "Only super-admins can change user roles" 
    });
  }
  next();
};