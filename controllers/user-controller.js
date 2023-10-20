const mongoose = require("mongoose");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({
        Message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    const result = await newUser.save();

    console.log(result);
    res.status(201).json({
      Message: "Account created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while creating the user",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({
        Message: "Email is incorrect",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes expired
    const refreshTokenExp = Math.floor(
      new Date().setDate(new Date().getDate() + 7) // 7 days expired
    );

    if (isPasswordValid) {
      const accessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_KEY,
        {
          expiresIn: accessTokenExp,
        }
      );

      const refreshToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_KEY,
        {
          expiresIn: refreshTokenExp,
        }
      );

      // Set access token as a cookie
      res.cookie("access_token", accessToken, {
        // maxAge: 1000 * 60 * 60, // 1 hour expired
        httpOnly: true,
        secure: true,
      });

      // Set refresh token as a cookie
      res.cookie("refresh_token", refreshToken, {
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days expired
        httpOnly: true,
        secure: true,
      });

      return res.status(200).json({
        Message: "Login successful",
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        ExpiredTime: accessTokenExp,
      });
    }

    res.status(401).json({
      Message: "Password is incorrect",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while processing the login",
    });
  }
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.status(200).json({
    Message: "Logout successful",
  });
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find().select("_id email role").exec();
    console.log(users);

    const response = {
      Message: "Success get all users",
      Count: users.length,
      Users: users.map((user) => {
        return {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while fetching users",
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await User.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({
        Message: "User not found",
      });
    }

    res.status(200).json({
      Message: "User deleted successfully",
      Result: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while deleting the user",
    });
  }
};

const passwordResetRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({
        Message: "Email not found",
      });
    }

    const key = Math.random().toString(36).substring(2, 15);
    user.resetPasswordKey = key;
    await user.save();

    console.log(`Password reset key for ${email}: ${key}`);

    res.status(200).json({
      Message: "Password reset key has been sent to your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error:
        err.message ||
        "An error occurred while processing the password reset request",
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetPasswordKey: key }).exec();

    if (!user) {
      return res.status(404).json({
        Message: "Invalid key",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordKey = undefined;
    await user.save();

    res.status(200).json({
      Message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while resetting the password",
    });
  }
};

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, newPassword } = req.body;

//     const user = await User.findOne({ email }).exec();

//     if (!user) {
//       return res.status(401).json({
//         Message: "Email is incorrect",
//       });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user password
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({
//       Message: "Password reset successful",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       Error: err.message || "An error occurred while resetting the password",
//     });
//   }
// };

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  getUser,
  logoutUser,
  passwordResetRequest,
  resetPassword,
};
