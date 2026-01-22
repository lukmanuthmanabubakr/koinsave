const walletService = require("./wallet.service");

function koboToNaira(kobo) {
  return Number((kobo / 100).toFixed(2));
}

async function getMyWallet(req, res) {
  const wallet = await walletService.getWalletByUserId(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Wallet fetched successfully",
    data: {
      currency: wallet?.currency || "NGN",
      balance: koboToNaira(wallet?.balance ?? 0),
    },
  });
}

module.exports = { getMyWallet };
