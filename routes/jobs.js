import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://asishsahu946:K7J0uvpT3fAgpiJ2@personalproject.l7iga.mongodb.net/");

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
  try {
    const {
      jobTitle,
      location,
      category,
      jobType,
      experienceLevel,
      datePosted,
      salary,
    } = req.body;

    const filter = {};

    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" }; 
    if (location) filter.formattedAddress = { $regex: location, $options: "i" };
    if (category && category.length > 0) filter.category = { $in: category };
    if (jobType && jobType.length > 0) filter.jobType = { $in: jobType };
    if (experienceLevel && experienceLevel.length > 0)
      filter.experience = { $in: experienceLevel };
    if (salary) filter.salary = { $gte: salary }; 

    if (datePosted && datePosted.length > 0) {
      const currentDate = new Date();
      let startDate;

      switch (datePosted[0]) {
        case "Today":
          startDate = new Date(currentDate.setHours(0, 0, 0, 0));
          break;
        case "Last 24 hours":
          startDate = new Date(currentDate.setHours(currentDate.getHours() - 24));
          break;
        case "Last 7 days":
          startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
          break;
        case "Last 30 days":
          startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filter._id = {
          $gte: ObjectId.createFromTime(Math.floor(startDate.getTime() / 1000)),
        };
      }
    }

    const filterData = await db
      .collection("jobs")
      .find(filter)
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json(filterData);
  } catch (error) {
    console.error("Error filtering jobs:", error);
    res.status(500).json({ error: "Failed to filter jobs" });
  }
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
