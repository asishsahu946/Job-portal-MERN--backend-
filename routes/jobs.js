import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

const router = express.Router();
await client.connect();

const db = client.db("jobApp");
const collection = db.collection("jobs");

// Read jobs
router.get("/getjobs", async (req, res) => {
  try {
    const jobsData = await collection.find().sort({ _id: -1 }).toArray();
    res.status(200).json(jobsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/getjobs/:id", async (req, res) => {
  const jobDetails = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.status(200).json(jobDetails);
});

// Read jobs based on user id
router.get("/userjobs/:id", async (req, res) => {
  const jobDetails = await collection.find({userId: req.params.id}).toArray();
  res.status(200).json(jobDetails);
})


// Validation
await db.command({
  collMod: "jobs",
  validator: {},
  validationLevel: "strict",
  validationAction: "error",
});

// Create job
router.post("/postjobs", async (req, res) => {
  try {
    await collection.insertOne(req.body);
    res.json({ message: "Job Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to insert job data" });
  }
});

// Filter job
router.post("/filterjobs", async (req, res) => {
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
router.delete("/deletejobs/:id", async (req, res) => {
  await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.status(200).json({ message: "Job Data deleted successfully" });
});

// Update job
router.patch("/updatejobs/:id", async (req, res) => {
  await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.status(200).json({ message: "Job Data updated successfully" });
});

export default router;
