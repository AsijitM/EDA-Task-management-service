const express = require("express");
const Task = require("../models/Task");
const amqp = require("amqplib");

const router = express.Router();

router.post("/tasks", async (req, res) => {
  const { title, description, userId } = req.body;

  const task = new Task({ title, description, userId });
  await task.save();

  // Publish task creation event
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const exchange = "task_events";

  channel.assertExchange(exchange, "fanout", { durable: false });
  channel.publish(exchange, "", Buffer.from(JSON.stringify(task)));

  console.log("Task created:", task);
  res.status(201).send(task);
});

module.exports = router;
