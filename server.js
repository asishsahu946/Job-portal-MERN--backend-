import express from "express";
import { MongoClient, ObjectId } from "mongodb";
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

// Read jobs
app.get("/getjobs", async (req, res) => {
  try {
    const jobsData = await collection.find().sort({ _id: -1 }).toArray();
    res.status(200).json(jobsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.get("/getjobs/:id", async (req, res) => {
  const jobDetails = await collection.findOne({ _id: new ObjectId(req.params.id) });
  res.status(200).json(jobDetails);
});

// Validation
await db.command({
  collMod: "jobs",
  validator: {},
  validationLevel: "strict",
  validationAction: "error",
});

// Create job
app.post("/postjobs", async (req, res) => {
  try {
    await collection.insertOne(req.body);
    res.json({ message: "Job Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to insert job data" });
  }
});

// Filter job
app.post("/filterjobs", async (req, res) => {
  const filterData = await db
    .collection("jobs")
    .find({
      jobTitle: req.body.jobTitle,
      // formmattedAddress: req.body.location,
      // category: req.body.category,
      // jobType: req.body.jobType,
      // experience: req.body.experienceLevel,
      // // _id: req.body.datePosted // this is the date posted problem
      // salary: req.body.salary
    })
    .sort({ _id: -1 })
    .toArray();
  res.status(200).json(filterData);
  return filterData;
});

// Delete job
app.delete("/deletejobs", async (req, res) => {

})

// Update job


app.listen(4000, () => {
  console.log("Server Started on port 4000");
});
