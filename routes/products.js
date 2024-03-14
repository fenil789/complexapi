const express = require("express");
// const multer = require("multer");

const checkuser = require("../middleware/authroute");

const upload = require("../utils/fileupload");
const {
  addproducts,
  displayproducts,
  updateproducts,
  deleteproduct,
  searchproduct,
  pagination,
} = require("../controllers/productcontroller");
const ErrorHandler = require("../error/errorHandler");
const router = express.Router();

router.use(checkuser);

router.post("/add", upload, addproducts);

router.get("/display", displayproducts);
router.put("/update/:id", updateproducts);
router.delete("/delete/:id", deleteproduct);
router.post("/search", searchproduct);
router.get("/pagination", pagination);

module.exports = router;
