const express = require("express");
const Joi = require("joi");
require("dotenv").config();
let jwt = require("jsonwebtoken");
const connection = require("../utils/connection");
const ErrorHandler = require("../error/errorHandler");
const tryCatch = require("../error/trycatch");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});
const userlogin = tryCatch(async (req, res) => {
  const { error, value } = await loginSchema.validate(req.body);
  if (error) {
    throw ErrorHandler.validationError(error.message);
  } else {
    const { email, password } = req.body;

    connection.query(
      "SELECT * FROM users WHERE email=? AND password=?",
      [email, password],
      (error, result) => {
        if (error) {
          throw ErrorHandler.databaseError(error.message);
        }
        if (result.length > 0) {
          const logintoken = jwt.sign(result[0], process.env.login_secret_key, {
            expiresIn: "1m",
          });
          const refreshtoken = jwt.sign(
            result[0],
            process.env.login_secret_key,
            {
              expiresIn: "10m",
            }
          );
          res.cookie("loginid", result[0].id, {
            maxAge: 3600000,
            httpOnly: true,
          });

          res.cookie("logintoken", logintoken, {
            httpOnly: true,
          });
          res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
          });

          res.status(200).json({ message: "User logged in successfully" });
        } else {
          res.status(404).json({ message: "Invalid email or password" });
        }
      }
    );
  }

  // res.status(error.statusCode || 500).json({ error: error.message });
});

const schema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.required(),
});
const userReg = tryCatch(async (req, res) => {
  const { error, value } = await schema.validate(req.body);
  if (error) {
    console.log("error is");
    throw ErrorHandler.validationError(error.message);
  } else {
    const { firstname, lastname, email, password } = req.body;
    const data = connection.query(
      "INSERT INTO `users`(`firstname`, `lastname`,`email`,`password`) VALUES (?,?,?,?)",
      [firstname, lastname, email, password]
    );
    res.status(200).json({
      message: "User registered successfully",
    });
  }
});
const alluser = tryCatch(async (req, res) => {
  connection.query("SELECT * FROM users", (error, result) => {
    if (error) {
      throw ErrorHandler.databaseError();
    } else {
      res.send(result);
    }
  });
});
const oneUser = tryCatch(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  connection.query("SELECT * FROM users where id=?", [id], (error, result) => {
    if (result.length > 0) {
      // console.log(result);
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "user not Found" });
    }
  });
});
const deleteuser = tryCatch(async (req, res) => {
  const id = req.params.id;
  connection.query("delete from users where id=?", [id], (error, result) => {
    // console.log("error", error);

    if (result.affectedRows !== 0) {
      // throw ErrorHandler.notFound("User not found");
      return res.status(200).json({ message: "User deleted successfully" });
    }
    return res.status(404).json({ error: "User not found" });
  });
});

const updateUser = tryCatch(async (req, res) => {
  // res.send("done");
  const id = req.params.id;
  const { firstname, lastname, email, password } = req.body;
  connection.query(
    "update users set firstname=?,lastname=?,email=? ,password=? where id=?",
    [firstname, lastname, email, password, id],
    (err, result) => {
      if (result.affectedRows !== 0) {
        // throw ErrorHandler.notFound("User not found");
        return res.status(200).json({ message: "User updated successfully" });
      }
      return res.status(404).json({ error: "User not found" });
    }
  );
  // connection.query();
});

module.exports = {
  userlogin,
  userReg,
  alluser,
  oneUser,
  deleteuser,
  updateUser,
};
