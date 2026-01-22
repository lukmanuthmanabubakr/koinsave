const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI is not set on the server");

  if (isConnected) return;

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  console.log("MongoDB connected");
}

module.exports = connectDB;
