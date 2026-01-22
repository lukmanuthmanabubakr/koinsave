const service = require("./transaction.service");

async function transfer(req, res) {
  const { toUserEmail, amount } = req.body;

  try {
    const data = await service.transferMoney({
      fromUserId: req.user._id,
      toUserEmail,
      amountNaira: Number(amount),
    });

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Transfer failed",
      errors: [],
    });
  }
}

async function myTransactions(req, res) {
  try {
    const data = await service.getMyTransactions(req.user._id, req.query.limit);
    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: { transactions: data },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      errors: [],
    });
  }
}

module.exports = {
  transfer,
  myTransactions,
};
