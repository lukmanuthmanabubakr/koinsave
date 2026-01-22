require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/db/connect");

let ready = false;

module.exports = async (req, res) => {
  if (!ready) {
    await connectDB(process.env.MONGO_URI);
    ready = true;
  }
  return app(req, res);
};
