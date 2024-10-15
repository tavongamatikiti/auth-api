import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import otpGenerator from "otp-generator";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password });

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  user.otp = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  await user.save();

  console.log(`OTP for ${email}: ${otp}`);

  // Send OTP via email
  await sendEmail(email, "Verify your email", `Your OTP code is ${otp}`);

  generateToken(res, user._id);

  res.status(201).json({
    message: "Registration successful. Please check your email for the OTP.",
  });
});

// @desc    Verify OTP for user registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP/email" });
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (user.otp !== hashedOTP || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.json({
    message: "Email verified successfully",
    token: generateToken(res, user._id),
  });
});

// @desc    Resend OTP for user registration
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  console.log(`Generated OTP for ${email}: ${otp}`);

  // Set new OTP and expiry time
  user.otp = hashedOTP;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send the OTP to the user's email
  const emailOptions = {
    to: user.email, // Ensure this is populated with the correct recipient
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(emailOptions);
    res.json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("Error sending email:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error sending OTP, please try again later" });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if password matches
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Check if email is verified
  if (!user.isVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  // Generate numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // Update user with new OTP and expiry time
  user.otp = hashedOTP;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  // Log OTP for testing purposes (remove in production)
  console.log(`Generated OTP for ${email}: ${otp}`);

  // Send OTP via email
  const emailOptions = {
    to: email, // Ensure this is populated with the correct recipient
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(emailOptions);
    generateToken(res, user._id); // Generate token if needed (e.g., for setting a cookie or something else)
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending email:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Error sending OTP, please try again later" });
  }
});
// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update my profile
// @route   PUT /api/auth/:id
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete my profile
// @route   DELETE /api/auth/:id
// @access  Private
const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(401).json({ message: "User not found" });
  }

  res
    .clearCookie("jwt")
    .status(200)
    .json({ message: "Profile deleted successfully" });
});

// @desc    Delete my profile
// @route   DELETE /api/auth/:id
// @access  Private
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  await sendEmail(email, "Password Reset Token", message);

  res.status(200).json({ message: "Email sent successfully" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log(`Received token: ${token}`);
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  if (typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token format" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successful",
    token: generateToken(res, user._id),
  });
});

export {
  login,
  register,
  verifyOTP,
  logout,
  deleteProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  resendOTP,
};
