import express from 'express';
import { MongoClient } from "mongodb";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
console.log("Connected to MongoDB");

const db = client.db("jobApp");
const collection = db.collection("users");

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables in production

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await collection.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token , userId: user._id });
    }
    res.status(400).json({ message: "Invalid credentials"});
});

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    await collection.insertOne({ name, email, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
  });


  router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  });
export default router;