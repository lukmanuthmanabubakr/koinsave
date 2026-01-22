const authService = require("./auth.service");
const { registerSchema, loginSchema } = require("./auth.validation");

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: parsed.error.issues,
    });
  }

  try {
    const data = await authService.register(parsed.data);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong",
      errors: [],
    });
  }
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: parsed.error.issues,
    });
  }

  try {
    const data = await authService.login(parsed.data);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong",
      errors: [],
    });
  }
}

module.exports = {
  register,
  login,
};
