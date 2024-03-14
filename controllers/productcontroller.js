const express = require("express");
const Joi = require("joi");
const connection = require("../utils/connection");
const tryCatch = require("../error/trycatch");
const ErrorHandler = require("../error/errorHandler");

const schema = Joi.object({
  product_name: Joi.string().required(),
});
const schema1 = Joi.object({
  product_name: Joi.string().required(),
});

const addproducts = tryCatch(async (req, res) => {
  const user_id = parseInt(req.cookies.loginid);
  console.log(req.body.product_name);
  // console.log(req.files);  //for multiple image
  const { error, value } = await schema1.validate(req.body);
  if (error) {
    throw ErrorHandler.validationError(error.message);
  } else {
    const { product_name } = req.body;
    const data = connection.query(
      "INSERT INTO `products`(`product_name`,`product_image`, `userid`) VALUES (?,?,?)",
      [product_name, req.file.path, user_id],
      (err, result) => {
        if (err) throw ErrorHandler.validationError("somthing went wrong");
      }
    );
    res.status(200).json({
      message: "product added successfully",
    });
  }
});

const displayproducts = tryCatch(async (req, res) => {
  const user_id = parseInt(req.cookies.loginid);
  connection.query(
    "SELECT * FROM products where userid=?",
    [user_id],
    (error, result) => {
      if (result.length > 0) {
        // console.log(result);
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "products not Found" });
      }
    }
  );
});

const updateproducts = tryCatch(async (req, res) => {
  const user_id = parseInt(req.cookies.loginid);
  const id = req.params.id;
  const { error, value } = await schema.validate(req.body);
  connection.query(
    "update products set product_name=? where id=? and userid=? ",
    [req.body.product_name, id, user_id],
    (err, result) => {
      if (result.affectedRows !== 0) {
        // throw ErrorHandler.notFound("User not found");
        return res
          .status(200)
          .json({ message: "product updated successfully" });
      }
      return res.status(404).json({ error: "product not found" });
    }
  );
});

const deleteproduct = tryCatch(async (req, res) => {
  const user_id = parseInt(req.cookies.loginid);
  const id = req.params.id;
  connection.query(
    "delete from products where id=? and userid=?",
    [id, user_id],
    (error, result) => {
      console.log("error", error);

      if (result.affectedRows !== 0) {
        // throw ErrorHandler.notFound("User not found");
        return res
          .status(200)
          .json({ message: "products deleted successfully" });
      }
      return res.status(404).json({ error: "products not found" });
    }
  );
});

const searchproduct = tryCatch(async (req, res) => {
  const user_id = parseInt(req.cookies.loginid);
  const product_name = req.body.product_name;

  connection.query(
    "SELECT * FROM products where userid=? and product_name=?",
    [user_id, product_name],
    (error, result) => {
      if (result.length > 0) {
        // console.log(result);
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "products not Found" });
      }
    }
  );
});

// offsetbased pagination
// const pagination = tryCatch((req, res) => {
//   const { page, limit } = req.query;

//   const offset = (page - 1) * limit;

//   connection.query(
//     "SELECT * FROM products LIMIT ? OFFSET ?",
//     [+limit, +offset],
//     (error, data) => {
//       if (error) {
//         res.status(500).json({ error: error.message });
//       } else {
//         connection.query(
//           "SELECT COUNT(*) AS total FROM products",
//           (err, totalpagedata) => {
//             if (err) {
//               res.status(500).json({ error: err.message });
//             } else {
//               const totalRecords = totalpagedata[0].total;
//               const totalpage = Math.ceil(totalRecords / limit);

//               res.json({
//                 data: data,
//                 pagination: {
//                   page: +page,
//                   limit: +limit,
//                   totalRecords: totalRecords,
//                   totalpage: totalpage,
//                 },
//               });
//             }
//           }
//         );
//       }
//     }
//   );
// });

//cursor based pagination

const pagination = tryCatch((req, res) => {
  // let limit = req.query.limit;
  // let cursor = req.query.cursor || 0;
  // connection.query(
  //   "select * from products where id>? limit ?",
  //   [+cursor, +limit],
  //   (err, result) => {
  //     if (!err) {
  //       console.log(result);
  //       const hasMoreRows = result.length === +limit;
  //       res.json({
  //         items: result,
  //         nextpage: hasMoreRows ? result[result.length - 1].id : null,
  //       });
  //     }
  //   }
  // );
  const limit = req.query.limit;
  const cursor = req.query.cursor || 0;

  connection.query(
    "select * from products where id>? limit ?",
    [+cursor, +limit],
    (err, result) => {
      if (!err) {
        const hasmorerow = result.length === +limit;
        return res.json({
          items: result,
          nextpage: hasmorerow ? result[result.length - 1].id : null,
        });
      }
      throw ErrorHandler.databaseError("database error");
    }
  );
});
module.exports = {
  addproducts,
  displayproducts,
  updateproducts,
  deleteproduct,
  searchproduct,
  pagination,
};
