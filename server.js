import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors()); //Allows all origins
const client = new MongoClient(
  "mongodb+srv://asishsahu946:K7J0uvpT3fAgpiJ2@personalproject.l7iga.mongodb.net/"
);
await client.connect();

const db = client.db("jobApp");
const collection = db.collection("jobs");
const jobsData = await collection.find().sort({_id: -1}).toArray();

app.get("/getjobs", (req, res) => {
  res.status(200).send(jobsData);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/postjobs", async (req, res) => {
  console.log(req.body);
  await collection.insertOne(req.body);
  res.json({ message: "Job successfully Posted", data: req.body });
});

app.listen(4000, () => {
  console.log("Server Started on port 4000");
});
