const mongoose = require("mongoose");

let db;

const connectToDatabase = async () => {
  if (!db) {
    try {
      // Connect to MongoDB using MONGO_URI
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = mongoose.connection;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  return db;
};

const databaseMiddleware = async (req, res, next) => {
  try {
    const connection = await connectToDatabase();
    req.db = connection;
  } catch (error) {
    console.error("Error in databaseMiddleware:", error);
  }
  next();
};

module.exports = databaseMiddleware;
