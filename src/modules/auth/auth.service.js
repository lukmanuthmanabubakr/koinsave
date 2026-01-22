const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../users/user.model");
const walletService = require("../wallet/wallet.service");

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

async function register({ fullName, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 400;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create([{ fullName, email, password }], { session });
    const createdUser = user[0];

    await walletService.createWalletForUser(createdUser._id, session);

    await session.commitTransaction();
    session.endSession();

    const token = signToken(createdUser._id);

    return {
      token,
      user: {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
      },
    };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  };
}

module.exports = {
  register,
  login,
};
