const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Service = require("../models/Service");

router.get("/wishlist", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const wishlistItems = await Wishlist.find({
      userId: req.session.userId,
    }).populate("serviceId");
    res.render("wishlist/wishlist", { wishlistItems }); // matches renamed file
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading wishlist.");
  }
});

router.post("/wishlist/add/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const userId = req.session.userId;
  const serviceId = req.params.id;

  try {
    const existing = await Wishlist.findOne({ userId, serviceId });
    if (!existing) {
      await Wishlist.create({ userId, serviceId });
    }
    res.redirect("/services");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to wishlist.");
  }
});

router.post("/wishlist/remove/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    await Wishlist.findOneAndDelete({
      userId: req.session.userId,
      serviceId: req.params.id,
    });
    res.redirect("/wishlist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to remove item.");
  }
});

module.exports = router;
