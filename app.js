const express = require("express");

const cookieParser = require("cookie-parser");
const ErrorHandler = require("./error/errorHandler");
const userRouter = require("./routes/user");
const productRouter = require("./routes/products");
require("dotenv").config();

const connection = require("./utils/connection");
const multer = require("multer");
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//   throw ErrorHandler.validationError("give prorper values");
// });

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connecteed");
  }
});

app.use("/", userRouter);
app.use("/products", productRouter);
app.use("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    return res.status(err.status).json({
      error: {
        status: err.status,
        message: err.message,
      },
    });
  } else {
    return res
      .status(err.statusCode || 500)
      .json({ error: "internal server errorddd" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is start ${process.env.PORT} `);
});
