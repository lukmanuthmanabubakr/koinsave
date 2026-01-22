const express = require("express");
const { protect } = require("../../middlewares/auth");
const controller = require("./wallet.controller");

const router = express.Router();

router.get("/me", protect, controller.getMyWallet);

module.exports = router;
