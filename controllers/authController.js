const User = require("../models/User");

exports.showRegister = (req, res) => {
  res.render("auth/register");
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect("/");
  } catch (err) {
    res.send("Registration error: " + err.message);
  }
};

exports.showLogin = (req, res) => {
  res.render("auth/login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.send("Invalid email or password");
    }
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.userName = user.name;
    res.redirect("/");
  } catch (err) {
    res.send("Login error: " + err.message);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
