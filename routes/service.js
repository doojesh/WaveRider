const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const upload = require("../middleware/upload");

// Middleware to restrict to admin
function isAdmin(req, res, next) {
  if (req.session.role === "admin") return next();
  return res.status(403).send("Access denied.");
}

// GET - render add service form
router.get("/admin/services/new", isAdmin, (req, res) => {
  res.render("services/add");
});

// POST - Upload image and create a service (only this one needed)
router.post(
  "/admin/services",
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { code, description, price } = req.body;

      if (!code || !description || !price) {
        return res.status(400).send("All fields are required.");
      }

      const image = req.file ? `/uploads/${req.file.filename}` : null;

      await Service.create({ code, description, price, image });

      res.redirect("/services");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err.message);
    }
  }
);
// GET - render all services
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find({});
    res.render("services/list", { services });
  } catch (err) {
    res.status(500).send("Error fetching services");
  }
});

module.exports = router;
