const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/routes.js");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tasks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", taskRoutes);

app.listen(4000, () => {
  console.log("Task Service running on port 4000");
});
