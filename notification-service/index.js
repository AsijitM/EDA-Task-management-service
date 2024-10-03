const amqp = require("amqplib");
const nodemailer = require("nodemailer");

const run = async () => {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const exchange = "task_events";

  channel.assertExchange(exchange, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  channel.bindQueue(q.queue, exchange, "");

  channel.consume(
    q.queue,
    async (msg) => {
      const task = JSON.parse(msg.content.toString());
      console.log("Notification: New Task Created:", task);

      // Send email notification
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "otherwork6969@gmail.com",
          pass: process.env.STMP_CODE
        },
      });

      const mailOptions = {
        from: "your-email@gmail.com",
        to: task.userId, // Assuming userId is an email
        subject: "New Task Created",
        text: `A new task has been created:\n\nTitle: ${task.title}\nDescription: ${task.description}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent to:", task.userId);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    },
    { noAck: true }
  );
};

run().catch(console.error);
