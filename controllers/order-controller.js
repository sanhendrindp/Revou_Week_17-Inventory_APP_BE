const mongoose = require("mongoose");
const Order = require("../models/order-model");
const Product = require("../models/product-model");

const getAllOrder = async (req, res, next) => {
  try {
    const docs = await Order.find().select("_id productId quantity").exec();

    console.log(docs);

    const response = {
      Message: `Success get all orders`,
      Count: docs.length,
      Orders: docs.map((doc) => {
        return {
          _id: doc._id,
          productId: doc.productId,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + doc._id,
            // url:
            //   "https://week-11-sanhendrindp-production.up.railway.app/orders/" +
            //   doc._id,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while fetching orders",
    });
  }
};

const createOrder = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    // If productId not exist, 404 not found (can't create order)
    if (!product) {
      return res.status(404).json({
        Message: "Product not found",
      });
    }

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    const result = await order.save();

    console.log(result);

    res.status(201).json({
      Message: `Order created successfully`,
      Order: {
        _id: result._id,
        productId: result.productId,
        quantity: result.quantity,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
          // url:
          //   "https://week-11-sanhendrindp-production.up.railway.app/orders/" +
          //   result._id,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while creating the order",
    });
  }
};

const getOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Order.findById(id)
      .select("_id productId quantity")
      .exec();

    console.log(doc);

    if (doc) {
      res.status(200).json({
        Message: `Order for ID ${id} found`,
        Order: doc,
      });
    } else {
      res.status(404).json({
        Message: `No order found for provided ID`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error:
        err.message ||
        `An error occurred while fetching the order with ID ${id}`,
    });
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Order.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({
        Message: "Order not found",
      });
    }

    res.status(200).json({
      Message: "Order deleted successfully",
      Result: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while deleting the order",
    });
  }
};

module.exports = { getAllOrder, createOrder, getOrder, deleteOrder };
