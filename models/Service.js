const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String }, // URL or local path
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Service", serviceSchema);
