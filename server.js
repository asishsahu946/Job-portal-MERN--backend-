import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors()); // Allows all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(
  "mongodb+srv://asishsahu946:K7J0uvpT3fAgpiJ2@personalproject.l7iga.mongodb.net/"
);

await client.connect();
const db = client.db("jobApp");
const collection = db.collection("jobs");

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/getjobs", async (req, res) => {
  try {
    const jobsData = await collection.find().sort({ _id: -1 }).toArray();
    res.status(200).json(jobsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

await db.command({collMod: "jobs",
  validator: {},
  validationLevel: "strict",
  validationAction: "error",
})

app.post("/postjobs", async (req, res) => {

  try {
    await collection.insertOne(req.body);
    res.json({ message: "Job Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to insert job data" });
  }
});

app.listen(5000, () => {
  console.log("Server Started on port 5000");
});
