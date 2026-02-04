const User = require("../models/User");

/**
 * GET /api/users - List all users (admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers };
