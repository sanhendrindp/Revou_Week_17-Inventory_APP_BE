const mongoose = require("mongoose");

const orderModel = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

// Export Order model
module.exports = mongoose.model("Order", orderModel);
