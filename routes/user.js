const express = require("express");
const {
  userlogin,
  userReg,
  alluser,
  oneUser,
  deleteuser,
  updateUser,
} = require("../controllers/usercontroller");
const checkuser = require("../middleware/authroute");
const router = express.Router();

router.post("/login", userlogin);
router.post("/register", userReg);

router.use(checkuser);

router.get("/alluser", alluser);
router.get("/oneuser/:id", oneUser);

router.delete("/delete/:id", deleteuser);
router.put("/update/:id", updateUser);
module.exports = router;
