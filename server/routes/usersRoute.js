const User = require("../models/userModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) throw new Error("User with this email already exists");

    // Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // Create new user
    await User.create(req.body);

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User with this email does not exist");

    // Check if user is active
    if (!user.isActive) throw new Error("User is not active");

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Invalid password");

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get current user (protected)
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.put("/update-user", authMiddleware, async (req, res) => {
  try {
    if (req.body.newPassword && req.body.oldPassword) {
      const oldPassword = req.body.oldPassword;
      const user = await User.findById(req.body._id);
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) throw new Error("The old password is incorrect");

      const newPassword = await bcrypt.hash(req.body.newPassword, 10);
      req.body.password = newPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
