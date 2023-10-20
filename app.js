const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const morgan = require("morgan"); // use morgan middleware for logging request & respond
const { error } = require("console");
const mongoose = require("mongoose");
const databaseMiddleware = require("./middleware/databaseMiddleware");
const requestIdMiddleware = require("./middleware/requestIdMiddleware");
const helmet = require("helmet");
const productRoutes = require("./routes/product-routes");
const orderRoutes = require("./routes/order-routes");
const userRoutes = require("./routes/user-routes");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const OpenApiValidator = require("express-openapi-validator");
const cookieParser = require("cookie-parser");

const openApiPath = "./docs/openapi.yaml";
const file = fs.readFileSync(openApiPath, "utf-8");
const swaggerDocument = yaml.parse(file);
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(databaseMiddleware);
app.use(morgan("dev"));
app.use(helmet());
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: openApiPath,
//     validateRequest: true,
//   })
// );
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT;

// Routes
app.use("/products", requestIdMiddleware, productRoutes);
app.use("/orders", requestIdMiddleware, orderRoutes);
app.use("/users", requestIdMiddleware, userRoutes);

// ============================= LISTEN ===============================

app.get("/", requestIdMiddleware, (req, res) => {
  console.log(req.cookies);
  res.send(
    "Welcome! This is RESTful API Inventory Management System for Computer Store."
  );
});

app.listen(port, () => {
  console.log(`🌩 Server is running on port: ${port} 🌩`);
});

// Error handlers
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    Error: error.message,
  });
});
