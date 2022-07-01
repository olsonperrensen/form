//import modules installed at the previous step. We need them to run Node.js server and send emails
const { Client } = require('pg');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config();
const fs = require('fs');

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

//start application server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("The server started on port 3000");
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

let nieuw_clients = []
let id = 0;
let sales_per = []
let isRecordInDB = false;

app.get('/', (req, res) => res.send("Hello world!"));
app.get('/clients', (req, res) => {

  client.query('SELECT * FROM biz;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      nieuw_clients.push(row.biz_name)
    }
    console.log("Fetched from DB")
  });
  res.send(nieuw_clients);
  nieuw_clients = []
});


app.get('/sendmail', (req, res) => res.send("Send me a JSON object via POST. (Works with Zoho now."));

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {

  id++;

  let plnt = 0;
  let company_code = "A";
  let order = "A";
  let destinataries = [];

  if (req.body.land === "Belgie") {
    company_code = "be01";
    plnt = 1110;
    switch (req.body.merk) {
      case "DEWALT/LENOX": order = "BE_DEW_L4"; break;
      case "STANLEY": order = "BE_HDT_L4"; break;
      case "FACOM": order = "BE_IAR_L4"; break;
      case "BOSTITCH": order = "BE_BOS_L4"; break;
      default: order = "ERROR"; break;
    }
  } else {
    company_code = "nl01";
    plnt = 1510;
    switch (req.body.merk) {
      case "DEWALT/LENOX": order = "NL_DEW_L4"; break;
      case "STANLEY": order = "NL_HDT_L4"; break;
      case "FACOM": order = "NL_IAR_L4"; break;
      case "BOSTITCH": order = "NL_BOS_L4"; break;
      default: order = "ERROR"; break;
    }
  }

  sales_per = req.body.worker.split(' ')
  req.body.potype === "Pro" ? destinataries = [`Maximiliano.Iturria@sbdinc.com`, `${sales_per[0]}.${sales_per[1]}@sbdinc.com`] : destinataries = "Vicky.DeDecker@sbdinc.com";

  console.log("request came");
  const mailOptions = {
    from: "olsonperrensen@zohomail.eu",
    to: destinataries,
    subject: `Aanvrag #${id}`,
    html: `
    <ul>Requested by: ${req.body.worker}</ul>
    <ul>Timestamp: ${req.body.timestamp}</ul>
    <ul>Company: ${req.body.klantnaam}</ul>
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
    <ul>GR Execution date: ${req.body.datum}</ul>
    <ul>G/L Account: 47020000</ul>
    <ul>Order: ${order}</ul>`
  };
  const sendMail = (user, callback) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu", // hostname
      port: 465, // port for secure SMTP
      secure: true,
      auth: {
        user: 'olsonperrensen@zohomail.eu',
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

app.post('/clients', (req, res) => {
  // Add a client
  console.log(`New client came: "${req.body.new_client}"`);
  let isRecordInDB = false
  new Promise((resolve, reject) => {
    resolve(client.query(
      `INSERT INTO BIZ(biz_name) VALUES('${req.body.new_client}')`,
      (err, res) => {
        if (err) {
          isRecordInDB = false
          console.log(`CANNOT insert: ${err}`);
        }
        else {
          isRecordInDB = true;
          console.log(`record inserted ${req.body.new_client}`)
        }
      }
    ) + 1);
  }).then(() => {
    setTimeout(() => {
      console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
      if (isRecordInDB) {
        res.send("200")
      }
      else {
        res.send("500")
      }
    }, 1000);
  })

})

app.put('/clients', (req, res) => {
  console.log(`New edit came: "${req.body.old_client}" to be replaced with "${req.body.new_client}"`)
  new Promise((resolve, reject) => {
    resolve(client.query(
      `UPDATE BIZ SET biz_name = '${req.body.new_client}'
  where biz_name = '${req.body.old_client}'`,
      (err, res) => {
        if (err) {
          isRecordInDB = false
          console.log(`CANNOT update: ${err}`);
        }
        else {
          isRecordInDB = true;
          console.log(`record updated ${req.body.new_client}`)
        }
      }
    )+1);
  }).then(() => {
    setTimeout(() => {
      if (isRecordInDB) {
        res.send("200")
      }
      else {
        res.send("500")
      }
    
    }, 1000);})
})

app.delete('/clients', (req, res) => {
  console.log(`New delete came: "${req.body.old_client}"`)
  new Promise((resolve, reject) => {
    resolve(client.query(
      `DELETE FROM BIZ WHERE biz_name = '${req.body.old_client}'`,
      (err, res) => {
        if (err) {
          isRecordInDB = false
          console.log(`CANNOT delete: ${err}`);
        }
        else {
          isRecordInDB = true;
          console.log(`record deleted ${req.body.old_client}`)
        }
      }
    )+1);
  }).then(() => {
    setTimeout(() => {
      if (isRecordInDB) {
        res.send("200")
      }
      else {
        res.send("500")
      }  
    }, 1000);})

})