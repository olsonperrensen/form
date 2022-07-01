//import modules installed at the previous step. We need them to run Node.js server and send emails
const { Client } = require('pg');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config();
const fs = require('fs');

let nieuw_clients = []

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use();
app.use(function(req, res, next) {
  cors({origin: "*" })
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
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
client.query('SELECT * FROM biz;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    nieuw_clients.push(row.biz_name)
  }
  console.log("Fetched from DB")
});

let id = 0;
let del_pos = 0;
let sales_per = []

app.get('/',(req,res) => res.send("Hello world!"));
app.get('/clients',(req,res)=>{res.send(nieuw_clients)});


app.get('/sendmail',(req,res) => res.send("Send me a JSON object via POST. (Works with Zoho now."));

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {

    id++;

    let plnt = 0;
    let company_code = "A";
    let order = "A";
    let destinataries = [];

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

app.post('/clients',(req,res) => {
  // Add a client
  if(req.body.reason === "ADD") {
    console.log(`New client came: "${req.body.new_client}"`)
    nieuw_clients.push(req.body.new_client)
    client.query(
      `INSERT INTO BIZ(biz_name) VALUES('${req.body.new_client}')`,
      (err, res) => {
        if(err)
        {
          console.log(err);
        }
        else
        {
          console.log(`record inserted ${res}`)
          res.send(JSON.stringify({value:200}));
        }
      }
    );
  }
})

// TO-DO: Reimplement with PUT and DELETE HTTP PACKETS
  // Edit a client's content
  
setTimeout(() => {
  client.end();
}, 1680000);