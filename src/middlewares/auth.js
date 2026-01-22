const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");

async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. Missing token.",
        errors: [],
      });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. User not found.",
        errors: [],
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorised. Invalid or expired token.",
      errors: [],
    });
  }
}

module.exports = { protect };
