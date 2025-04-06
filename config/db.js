const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database successfully");
  } catch (err) {
    console.error("Connection to Database failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
