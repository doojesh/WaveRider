const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: { type: Date, required: true },
  status: { type: String, default: "confirmed" },
});

module.exports = mongoose.model("Booking", bookingSchema);
