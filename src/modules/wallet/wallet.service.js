const Wallet = require("./wallet.model");

async function createWalletForUser(userId, session) {
  const wallet = await Wallet.create(
    [
      {
        user: userId,
      },
    ],
    session ? { session } : undefined
  );

  return wallet[0];
}

async function getWalletByUserId(userId) {
  return Wallet.findOne({ user: userId }).lean();
}

module.exports = {
  createWalletForUser,
  getWalletByUserId,
};
