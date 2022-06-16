//import modules installed at the previous step. We need them to run Node.js server and send emails
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config()

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({origin: "*" }));
app.use(bodyParser.json());

//start application server on port 3000
app.listen(3000, () => {
  console.log("The server started on port 3000");
});


let id = 0;


// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {

    id++;

    let plnt = 0;
    let company_code = "A";
    let order = "A";
    let destinatary = "";

    if(req.body.land === "Belgie"){
        company_code = "be01";
        plnt = 1110;
        switch(req.body.merk)
        {
            case "DEWALT/LENOX": order="BE_DEW_L4"; break;
            case "STANLEY": order="BE_HDT_L4"; break;
            case "FACOM": order="BE_IAR_L4"; break;
            case "BOSTITCH": order="BE_BOS_L4"; break;
            default: order = "ERROR"; break;
        }
    } else {
        company_code = "nl01";
        plnt = 1510;
        switch(req.body.merk)
        {
            case "DEWALT/LENOX": order="NL_DEW_L4"; break;
            case "STANLEY": order="NL_HDT_L4"; break;
            case "FACOM": order="NL_IAR_L4"; break;
            case "BOSTITCH": order="NL_BOS_L4"; break;
            default: order = "ERROR"; break;
        }
    }

    req.body.potype === "Pro" ? destinatary = "Maximiliano.Iturria@sbdinc.com" : destinatary = "Vicky.DeDecker@sbdinc.com";

  console.log("request came");
  const mailOptions = {
    from: "olsonperrensen@outlook.com",
    to: destinatary,
    subject: `Aanvrag #${id}`,
    html: `
    <ul>Requested by: ${req.body.worker}</ul>
    <ul>Purch. Org.: 0001</ul>
    <ul>Purch. Group: LV4</ul>
    <ul>Company Code: ${company_code}</ul>
    <ul>A: f</ul>
    <ul>I: d</ul>
    <ul>Short text: ${req.body.omschijving}</ul>
    <ul>PO Quantity: 1</ul>
    <ul>Matl Group: level4</ul>
    <ul>Plnt: ${plnt}</ul>
    <ul>Overall Limit: ${req.body.bedrag}</ul>
    <ul>Expected value: ${req.body.bedrag}</ul>
    <ul>G/L Account: 47020000</ul>
    <ul>Order: ${order}</ul>`
  };
  const sendMail = (user, callback) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: 'olsonperrensen@outlook.com',
            pass: `${process.env.S3_BUCKET}`
        }
    });
    transporter.sendMail(mailOptions, callback);
  }
  let user = req.body;
  sendMail(user, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.send(info);
    }
  });



});