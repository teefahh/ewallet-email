const functions = require("@google-cloud/functions-framework");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent("helloPubSub", async (cloudEvent) => {

  // Decode the Pub/Sub message from base64
  const messageData = Buffer.from(cloudEvent.data.message.data, "base64").toString();

  // Parse the JSON string back into an object
  const jsonData = JSON.parse(messageData);

  // Access the fields in the JSON data
  const emailData = jsonData.emailData;
  const template = jsonData.template;

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_AUTH_USER,
          pass: process.env.EMAIL_AUTH_PASSWORD
      }
  });

  let mailOptions = {
    from: process.env.EMAIL_AUTH_USER, // Sender address
    to: emailData.email, // List of recipients
    subject: 'E-Wallet | Transaction Details', // Subject line
    text: 'Hello from Node.js!', // Plain text body
    html: template // HTML body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Message Sent: ${info.response}`);
  });
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});
