const mongoose = require("mongoose");

const UserRoles = {
  USER: "user",
  ADMIN: "admin",
};

const userModel = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [UserRoles.USER, UserRoles.ADMIN],
    default: UserRoles.USER, // Set to user role as default if none is specified
  },
});

// Export User model
module.exports = mongoose.model("User", userModel);
