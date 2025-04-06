const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Service = require("../models/Service");
const PDFDocument = require("pdfkit");
const moment = require("moment");

// Admin Middleware
function isAdmin(req, res, next) {
  if (req.session.role === "admin") return next();
  return res.status(403).send("Access denied.");
}

// GET - Admin Booking Dashboard with filter
router.get("/admin/booking-dashboard", isAdmin, async (req, res) => {
  const filter = req.query.filter;
  let query = {};

  if (filter === "past") {
    query.date = { $lt: new Date() };
  } else if (filter === "upcoming") {
    query.date = { $gte: new Date() };
  }

  try {
    const bookings = await Booking.find(query)
      .populate("userId")
      .populate("serviceId")
      .sort({ date: -1 });

    res.render("admin/booking-dashboard", { bookings, filter });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load admin bookings.");
  }
});

// GET - Export bookings to PDF
router.get("/admin/booking-dashboard/export", isAdmin, async (req, res) => {
  const filter = req.query.filter;
  let query = {};

  if (filter === "past") {
    query.date = { $lt: new Date() };
  } else if (filter === "upcoming") {
    query.date = { $gte: new Date() };
  }

  try {
    const bookings = await Booking.find(query)
      .populate("userId")
      .populate("serviceId")
      .sort({ date: -1 });

    const PDFDocument = require("pdfkit");
    const moment = require("moment");
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="bookings.pdf"');
    doc.pipe(res);

    doc
      .fontSize(18)
      .text("Wave Rider - Booking Report", { align: "center" });
    doc.fontSize(14).text(`Filter: ${filter || "All"}`, { align: "center" });
    doc.moveDown();

    bookings.forEach((b, index) => {
      const user = b.userId?.name || "N/A";
      const email = b.userId?.email || "N/A";
      const service = b.serviceId?.description || "N/A";
      const price = b.serviceId?.price || "N/A";
      const date = moment(b.date).format("DD MMM YYYY");

      doc
        .fontSize(12)
        .text(`#${index + 1}`, { continued: true })
        .text(` - ${service} on ${date}`, { continued: true })
        .text(` — ${user} (${email}) | Rs ${price}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate PDF.");
  }
});

// DELETE booking by ID (Admin only)
router.post(
  "/admin/booking-dashboard/:id/delete",
  isAdmin,
  async (req, res) => {
    try {
      await Booking.findByIdAndDelete(req.params.id);
      res.redirect("/admin/booking-dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to cancel booking.");
    }
  }
);

// GET all users
router.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render("admin/users", { users });
});

// POST promote/demote
router.post("/admin/users/:id/role", isAdmin, async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.redirect("/admin/users");
});
// routes/admin.js
router.get("/admin/analytics", isAdmin, async (req, res) => {
  const bookings = await Booking.find().populate("serviceId");
  const users = await User.find();
  const services = await Service.find();

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.serviceId?.price || 0),
    0
  );

  const bookingCountsByService = {};
  const revenueByService = {};

  bookings.forEach((b) => {
    const name = b.serviceId?.description || "Unknown";
    const price = b.serviceId?.price || 0;

    bookingCountsByService[name] = (bookingCountsByService[name] || 0) + 1;
    revenueByService[name] = (revenueByService[name] || 0) + price;
  });

  res.render("admin/analytics", {
    totalBookings: bookings.length,
    totalUsers: users.length,
    totalRevenue,
    bookingCountsByService,
    revenueByService,
  });
});

module.exports = router;
