import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "harshapolina1@gmail.com";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: email === ADMIN_EMAIL,
    });

    await newUser.save();

    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide valid input" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Email not found, register first" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (existingUser.email === ADMIN_EMAIL && !existingUser.isAdmin) {
      existingUser.isAdmin = true;
      await existingUser.save();
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const socialAuth = async (req, res) => {
  try {
    const { name, email, provider, providerId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.email === ADMIN_EMAIL && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }

      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || "secretKey",
        { expiresIn: "30d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        userId: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }

    const newUser = new User({
      name,
      email,
      password: `social_${providerId}_${Date.now()}`,
      isAdmin: email === ADMIN_EMAIL,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export { registerUser, loginUser, getUserProfile, getAllUsers, socialAuth };
