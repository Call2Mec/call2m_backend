// Md added code for make work the require function in node js---
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import nodemailer from "nodemailer";
//md added this tow line below---------
import express from "express";
import path from "path";
// import wbm from "wbm";

const { google } = require("googleapis");
const app = express();
const __dirname = path.resolve();
app.use("/public", express.static(path.join(__dirname, "public")));
// Md added oAuth2 Credentials----
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
class Email {
  constructor(email) {
    this.to = email;
    this.from = `"Aryan Sharma" <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });
    }
    // return nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: process.env.GMAIL,
    //     clientId: process.env.CLIENT_ID,
    //     clientSecret: process.env.CLIENT_SECRET,
    //     refreshToken: process.env.REFRESH_TOKEN,
    //     accessToken: oAuth2Client,
    //   },
    // });

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOSTDEV,

      port: process.env.EMAIL_PORTDEV,
      auth: {
        user: process.env.EMAIL_USERNAMEDEV,
        pass: process.env.EMAIL_PASSWORDDEV,
      },
    });
    
  }

  async send(text, subject, file, phone) {
    //2) define  email options
    /*if (subject === "your Estimate") {
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        text,
        attachments: [
          {
            filename: "Estimate.pdf",
            path: path.join(__dirname, "utils", "Estimate.pdf"),
            //   content: new buffer.from(file, "base64"),
            //   contentType: "application/pdf",
            //   content: 'THISISAB64STRING',
            //   encoding: 'base64',
          },
        ],
      };
    } else {
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        text,
      };
    }*/
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
      attachments: [
        {
          filename: "Estimate.pdf",
          path: path.join(__dirname, "utils", "Estimate.pdf"),
          //   content: new buffer.from(file, "base64"),
          //   contentType: "application/pdf",
          //   content: 'THISISAB64STRING',
          //   encoding: 'base64',
        },
      ],
    };

    //3) create an transport and send email

    await this.newTransport().sendMail(mailOptions);
    // WhatsApp message

    // wbm
    //   .start()
    //   .then(async () => {
    //     const phones = [phone];
    //     const message = text;
    //     await wbm.send(phones, message);
    //     await wbm.end();
    //   })
    //   .catch((err) => console.log(err));
  }

  async sendResetToken(message) {
    await this.send(message, "Password Reset");
  }

  async sendEstimate(message, subject, file, phone) {
    await this.send(message, subject, file, phone);
  }
}

export default Email;
