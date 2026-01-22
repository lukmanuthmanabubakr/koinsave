const express = require("express");
const { protect } = require("../../middlewares/auth");
const controller = require("./transaction.controller");

const router = express.Router();

router.post("/transfer", protect, controller.transfer);
router.get("/me", protect, controller.myTransactions);

module.exports = router;
