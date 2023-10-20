const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const checkRole = require("../middleware/role-auth");
const {
  createUser,
  loginUser,
  getUser,
  deleteUser,
  logoutUser,
  passwordResetRequest,
  resetPassword,
} = require("../controllers/user-controller");
const loginLimiter = require("../middleware/rate-limit");

// Route for create user
router.post("/signup", createUser);

// Route for login user
router.post("/login", loginLimiter, loginUser);

// Route for logout user
router.post("/logout", logoutUser);

// Route for get all user
router.get("/", checkAuth, checkRole(["admin"]), getUser);

// Route for delete user
router.delete("/:id", checkAuth, checkRole(["admin"]), deleteUser);

// Route for requesting reset user password
router.post("/reset-password", passwordResetRequest);

// Route for resetting password
router.post("/reset-password/:token", resetPassword);

// Route for reset password without request token/key
// router.post("/reset-password", resetPassword);

// Export
module.exports = router;
