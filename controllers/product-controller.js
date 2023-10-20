const mongoose = require("mongoose");
const Product = require("../models/product-model");

const getAllProduct = async (req, res, next) => {
  try {
    const docs = await Product.find()
      .select("_id name price productImage")
      .exec();

    console.log(docs);

    const response = {
      Message: `Success get all products`,
      Count: docs.length,
      Products: docs.map((doc) => {
        return {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
            // url:
            //   "https://week-11-sanhendrindp-production.up.railway.app/products/" +
            //   doc._id,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while fetching products",
    });
  }
};

const createProduct = async (req, res, next) => {
  try {
    console.log(req.file);

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });

    // Upload image is optional
    if (req.file) {
      product.productImage = req.file.path;
    }

    // Store to database
    const result = await product.save();

    console.log(result);

    res.status(201).json({
      Message: `Product created successfully`,
      Product: {
        _id: result._id,
        name: result.name,
        price: result.price,
        productImage: result.productImage,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id,
          // url:
          //   "https://week-11-sanhendrindp-production.up.railway.app/products/" +
          //   result._id,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while creating the product",
    });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Product.findById(id)
      .select("_id name price productImage")
      .exec();

    console.log(doc);

    if (doc) {
      res.status(200).json({
        Message: `Product for ID ${id} found`,
        Product: doc,
      });
    } else {
      res.status(404).json({
        Message: `No product found for provided ID`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while fetching the product",
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, price } = req.body;

    const result = await Product.updateOne(
      { _id: id },
      { $set: { name, price } }
    ).exec();

    console.log(result);

    res.status(200).json({
      Message: `Product for ID ${id} updated`,
      Product: {
        type: "GET",
        url: "http://localhost:3000/products/" + id,
        // url:
        //   "https://week-11-sanhendrindp-production.up.railway.app/products/" +
        //   id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error:
        err.message ||
        `An error occurred while updating the product with ID ${id}`,
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Product.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({
        Message: "Product not found",
      });
    }

    res.status(200).json({
      Message: "Product deleted successfully",
      Result: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Error: err.message || "An error occurred while deleting the product",
    });
  }
};

module.exports = {
  getAllProduct,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
