const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const sendMail = require("../config/mailer");

// GET - Show user's bookings
router.get("/bookings", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const allBookings = await Booking.find({
      userId: req.session.userId,
    }).populate("serviceId");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const upcoming = allBookings.filter((b) => new Date(b.date) >= today);
    const past = allBookings.filter((b) => new Date(b.date) < today);

    res.render("booking/bookings", { upcoming, past });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bookings.");
  }
});

// GET - Booking Form
router.get("/book/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).send("Service not found");

    res.render("booking/book", { service });
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to load booking form.");
  }
});

// POST - Handle Booking & Send Email
router.post("/book/:id", async (req, res) => {
  const { date } = req.body;
  const userId = req.session.userId;
  const serviceId = req.params.id;

  try {
    // Check if already booked
    const existing = await Booking.findOne({ userId, serviceId, date });
    if (existing) {
      return res.send("You've already booked this service on this date.");
    }

    const booking = await Booking.create({ userId, serviceId, date });

    const user = await User.findById(userId);
    const service = await Service.findById(serviceId);

    // Safety check for email
    if (!user || !user.email) {
      console.error("Cannot send email: user or user.email is missing.");
      return res
        .status(500)
        .send("Booking created, but user email is missing.");
    }

    console.log("Sending confirmation email to:", user.email);

    // Email to user
    await sendMail({
      to: user.email,
      subject: "Booking Confirmed - Wave Rider",
      html: `
        <h2>Hi ${user.name || "Guest"},</h2>
        <p>Your booking for <strong>${
          service.description
        }</strong> on <strong>${new Date(
        date
      ).toDateString()}</strong> is confirmed.</p>
        <p>We look forward to seeing you on board!</p>
        <br>
        <p>— Wave Rider Team</p>
      `,
    });

    // Email to admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking from ${user.email}`,
      html: `
        <p><strong>${user.email}</strong> booked <strong>${
        service.description
      }</strong> for <strong>${new Date(date).toDateString()}</strong>.</p>
      `,
    });

    res.redirect("/bookings");
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).send("Booking failed.");
  }
});

// POST - Cancel a booking
router.post("/bookings/:id/cancel", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId, // Make sure user can only delete their own
    });

    res.redirect("/bookings");
  } catch (err) {
    console.error("Cancel booking failed:", err);
    res.status(500).send("Unable to cancel booking.");
  }
});

module.exports = router;
