const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendMail = functions.https.onCall((data, context) => {
  const dest = data.dest;
  const msg = data.msg;

  const mailOptions = {
    from: "MK15 Emailing Service <makerthon15.2022@gmail.com>",
    to: dest,
    subject: "New Appointment",
    text: `To whom it may concern,\n${msg}`,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return {
        data: {
          status: 500,
          message: error.toString(),
        },
      };
    }
    return { data: { status: 200, message: "sent" } };
  });
});
