const express = require("express");
const ErrorHandler = require("../error/errorHandler");
require("dotenv").config();
let jwt = require("jsonwebtoken");
const connection = require("../utils/connection");

const checkuser = (req, res, next) => {
  const auth = req.cookies.loginid;
  const authtoken = req.cookies.logintoken;
  const refreshtoken = req.cookies.refreshtoken;

  jwt.verify(authtoken, process.env.login_secret_key, function (err, decoded) {
    if (!err) {
      next();
    } else {
      jwt.verify(
        refreshtoken,
        process.env.login_secret_key,
        function (err, decoded) {
          if (!err) {
            connection.query(
              "select * from users where id=?",
              [+auth],
              (err, result) => {
                if (!err && result.length > 0) {
                  const logintoken = jwt.sign(
                    result[0],
                    process.env.login_secret_key,
                    {
                      expiresIn: "1m",
                    }
                  );
                  res.cookie("logintoken", logintoken, {
                    httpOnly: true,
                  });
                  next();
                } else {
                  next(ErrorHandler.loginRequired("Login required"));
                }
              }
            );
          } else {
            next(ErrorHandler.loginRequired("Login required"));
          }
        }
      );
    }
  });
};

module.exports = checkuser;
