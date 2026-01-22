require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

bootstrap();
