const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * POST /api/auth/register - User signup (USER-ONLY).
 * Role is ALWAYS forced to "user". Any role field from frontend is ignored.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Never use req.body.role — frontend must never control roles
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({ name, email, password, role: "user" });
    const token = generateToken(user._id, res);
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login - User or Admin login (role must match DB)
 * Request body must include role: "user" | "admin". Reject if role !== user.role (403).
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role: selectedRole } = req.body;
    if (!selectedRole || !["user", "admin"].includes(selectedRole)) {
      return res.status(400).json({ success: false, message: "Select login as User or Admin" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    // Strict role check: selected role must match DB role
    if (user.role !== selectedRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to log in as " + selectedRole + ".",
      });
    }
    const token = generateToken(user._id, res);
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout - Clear token cookie
 */
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: "lax" });
  res.status(200).json({ success: true, message: "Logged out" });
};

/**
 * GET /api/auth/me - Current user (requires valid JWT)
 * Used by frontend to verify auth and role before showing admin UI.
 */
const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  });
};

module.exports = { register, login, logout, getMe };
