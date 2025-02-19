import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
const client = new MongoClient(
  process.env.MONGODB_URL
);
await client.connect();

const db = client.db("jobApp");
const collection = db.collection("jobs");
const jobsData = await collection.find().toArray();

app.get("/getjobs", (req, res) => {
  res.send(jobsData);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/jobs", async (req, res) => {
  console.log(req.body);
  await collection.insertOne(req.body);
  res.json({ message: "Job successfully Posted", data: req.body });
});

app.listen(5000, () => {
  console.log("Server Started on port 5000");
});
