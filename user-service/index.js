const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/routes.js");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("User Service running on port 3000");
});
