import express from "express";
import cors from "cors";
import jobs from './routes/jobs.js'
import users from './routes/users.js'

const app = express();
app.use(cors()); // Allows all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.use("/jobs", jobs)
app.use("/users", users)



app.listen(4000, () => {
  console.log("Server Started on port 4000");
});
