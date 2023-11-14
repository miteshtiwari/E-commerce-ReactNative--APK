const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { connect } = require("./config/database");

require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // jp hum req.body krte hai w yhi hai input data ko pass krne k kaam ata
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

connect();

app.get("/", (req, res) => {
  console.log("hn");
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});
app.get("/custom", (req, res) => {
  console.log("Custom endpoint accessed");
  return res.json({
    success: true,
    message: "This is a custom endpoint!",
  });
});
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

const User = require("./models/user");
const Order = require("./models/order");

const sendVerificationEMail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "tiwarimitesh4@gmail.com",
      pass: "auae ppas vobz mrvk",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };
  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
//endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user witht the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verificatioion Failed" });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("comed");
    const { name, email, password } = req.body;

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ message: "User Already Registered" });
    }

    const newUser = new User({ name, email, password });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    await newUser.save();

    // sending verification mail to user

    sendVerificationEMail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "Mail Sent" });
  } catch (error) {
    console.log("error in registering the User", error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
});
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};
const secretkey = generateSecretKey();
app.post("/login", async (req, res) => {
  try {
    console.log("aa gya 1 baar", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No User " });
    }
    console.log("user", user);
    // check password
    if (user.password !== password) {
      return res.status(403).json({ message: "Password Incorrect" });
    }
    // const token = jwt.sign({ userId: user._id }, secretkey);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ token, secretkey, user });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User's not found" });
    }
    user.addresses.push(address);

    await user.save();
    res.status(200).json({ message: "Address created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in adding address" });
  }
});

app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
});
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});
