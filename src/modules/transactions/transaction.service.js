const mongoose = require("mongoose");
const User = require("../users/user.model");
const Wallet = require("../wallet/wallet.model");
const Transaction = require("./transaction.model");

function nairaToKobo(naira) {
  // avoid floating issues: 12.5 -> 1250
  return Math.round(Number(naira) * 100);
}

function koboToNaira(kobo) {
  return Number((kobo / 100).toFixed(2));
}

async function transferMoney({ fromUserId, toUserEmail, amountNaira }) {
  const amountKobo = nairaToKobo(amountNaira);

  if (!Number.isFinite(amountNaira) || amountNaira <= 0) {
    const err = new Error("Amount must be greater than zero");
    err.statusCode = 400;
    throw err;
  }

  if (amountKobo < 1) {
    const err = new Error("Amount too small");
    err.statusCode = 400;
    throw err;
  }

  const receiver = await User.findOne({ email: toUserEmail });
  if (!receiver) {
    const err = new Error("Receiver not found");
    err.statusCode = 400;
    throw err;
  }

  if (String(receiver._id) === String(fromUserId)) {
    const err = new Error("You cannot transfer to yourself");
    err.statusCode = 400;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOneAndUpdate(
      { user: fromUserId, balance: { $gte: amountKobo } },
      { $inc: { balance: -amountKobo } },
      { new: true, session }
    );

    if (!senderWallet) {
      const err = new Error("Insufficient funds");
      err.statusCode = 400;
      throw err;
    }

    const receiverWallet = await Wallet.findOneAndUpdate(
      { user: receiver._id },
      { $inc: { balance: amountKobo } },
      { new: true, session }
    );

    if (!receiverWallet) {
      const err = new Error("Receiver wallet not found");
      err.statusCode = 400;
      throw err;
    }

    const tx = await Transaction.create(
      [
        {
          fromUser: fromUserId,
          toUser: receiver._id,
          amount: amountKobo,
          status: "SUCCESS",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      transactionId: tx[0]._id,
      from: fromUserId,
      to: receiver.email,
      amount: Number(amountNaira),
      balanceAfter: koboToNaira(senderWallet.balance),
    };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

async function getMyTransactions(userId, limit = 20) {
  const n = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const txs = await Transaction.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
  })
    .sort({ createdAt: -1 })
    .limit(n)
    .populate("fromUser", "email fullName")
    .populate("toUser", "email fullName")
    .lean();

  return txs.map((t) => ({
    id: t._id,
    type: t.type,
    from: t.fromUser?.email,
    to: t.toUser?.email,
    amount: koboToNaira(t.amount),
    status: t.status,
    createdAt: t.createdAt,
  }));
}

module.exports = {
  transferMoney,
  getMyTransactions,
};
