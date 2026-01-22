const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const path = require("path");
const fs = require("fs");

const authRoutes = require("./modules/auth/auth.routes");
const walletRoutes = require("./modules/wallet/wallet.routes");
const transactionRoutes = require("./modules/transactions/transaction.routes");

const { apiLimiter } = require("./middlewares/rateLimit");
const errorHandler = require("./middlewares/error");

const swaggerUiDist = require("swagger-ui-dist");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(apiLimiter);

const swaggerYamlPath = path.join(__dirname, "docs", "swagger.yaml");
const swaggerHtmlPath = path.join(__dirname, "docs", "swagger.html");

app.use("/docs", express.static(swaggerUiDist.getAbsoluteFSPath()));

if (fs.existsSync(swaggerYamlPath)) {
  app.use("/docs/swagger.yaml", express.static(swaggerYamlPath));
} else {
  console.warn("Swagger YAML not found at:", swaggerYamlPath);
}

app.get("/docs", (req, res) => {
  if (fs.existsSync(swaggerHtmlPath)) {
    return res.sendFile(swaggerHtmlPath);
  }
  return res
    .status(500)
    .send("swagger.html not found. Please create src/docs/swagger.html");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use(errorHandler);

module.exports = app;
