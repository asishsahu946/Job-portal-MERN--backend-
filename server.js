import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
const client = new MongoClient("mongodb://127.0.0.1:27017");
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

app.listen(4000, () => {
  console.log("Server Started on port 4000");
});
