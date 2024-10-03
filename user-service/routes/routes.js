const express = require("express");
const User = require("../models/User");
const amqp = require("amqplib");

const router = express.Router();

router.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const user = new User({ name, email });
  await user.save();

  // Publish user creation event
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const exchange = "user_events";

  channel.assertExchange(exchange, "fanout", { durable: false });
  channel.publish(exchange, "", Buffer.from(JSON.stringify(user)));

  console.log("User created:", user);
  res.status(201).send(user);
});

module.exports = router;
