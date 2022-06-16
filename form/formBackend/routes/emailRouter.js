var express=require('express');
var bodyParser = require('body-parser')// importing body parser middleware to parse form content from HTML
var cors = require('./../cors');
const emailRouter = express.Router();
var nodemailer = require('nodemailer');//importing node mailer

emailRouter.route('/')
.options(cors.cors,(req,res)=>{
    console.log("Coming email here");
    res.sendStatus(200);
})

// route which captures form details and sends it to your personal mail
.post(cors.cors,(req,res,next)=>{
  /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
    here we are using gmail as our service 
    In Auth object , we specify our email and password
  */
    var transporter = nodemailer.createTransport({
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

  /*
    In mail options we specify from and to address, subject and HTML content.
    In our case , we use our personal email as from and to address,
    Subject is Contact name and 
    html is our form details which we parsed using bodyParser.
  */
 
    const myJSONForm = {    
      land:req.body.u_land,
      klantnaam:req.body.u_klantnaam,
      klantnr:req.body.u_klantnr,
      bedrag:req.body.u_bedrag,
      omschijving:req.body.u_omschrijving,
      merk:req.body.u_merk,
      datum:req.body.u_datum
    };

  var mailOptions = {
    from: 'olsonperrensen@outlook.com',//replace with your email
    to: 'Maximiliano.Iturria@sbdinc.com',//replace with your email
    subject: `NodeMail Testing`,
    html: JSON.stringify(myJSONForm)
  };
  
  /* Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
   call back as parameter 
  */

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send('MIJN ERROR') // if error occurs send error as response to client
    } else {
      console.log('YES, Email sent! : ' + info.response);
      res.send(JSON.stringify(myJSONForm))//if mail is sent successfully send Sent successfully as response
    }
  });
  
})


module.exports = emailRouter;