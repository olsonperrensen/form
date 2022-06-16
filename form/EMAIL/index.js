//import modules installed at the previous step. We need them to run Node.js server and send emails
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({origin: "*" }));
app.use(bodyParser.json());

//start application server on port 3000
app.listen(3000, () => {
  console.log("The server started on port 3000");
});





// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {


    let plnt = 0;
    let company_code = "A";
    let order = "A";

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

  console.log("request came");
  const mailOptions = {
    from: "olsonperrensen@outlook.com",
    to: `Maximiliano.Iturria@sbdinc.com`,
    subject: "Form",
    html: `
    0001;
    LV4;
    ${company_code};
    f;
    d;
    ${req.body.omschijving};
    1;
    level4;
    ${plnt};
    ${req.body.bedrag};
    ${req.body.bedrag};
    47020000;
    ${order}`
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
            pass: 'Kul214#!#'
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