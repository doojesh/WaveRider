const express = require("express");
const router = express.Router();
const sendContactEmail = require("../config/mailer");

router.get("/about", (req, res) => {
  res.render("about", { user: req.session.user });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    user: req.session.user,
    success: null,
    error: null,
  });
});
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendContactEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
          <h3>You’ve received a new message from the contact form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br>${message}</p>
        `,
    });

    res.render("contact", {
      user: req.session.user,
      success: "Your message has been sent successfully!",
      error: null,
    });
  } catch (err) {
    console.error("Contact email failed:", err);
    res.render("contact", {
      user: req.session.user,
      success: null,
      error: "Oops! Something went wrong. Please try again later.",
    });
  }
});
module.exports = router;
