const jwt = require("jsonwebtoken");

/**
 * Generate JWT and optionally set HTTP-only cookie
 * @param {string} userId - User _id
 * @param {object} res - Express response (optional, for cookie)
 * @returns {string} JWT token
 */
const generateToken = (userId, res = null) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  if (res) {
    const options = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    res.cookie("token", token, options);
  }

  return token;
};

module.exports = generateToken;
