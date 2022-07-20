//import modules installed at the previous step. We need them to run Node.js server and send emails
const { Client } = require('pg');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const CryptoJS = require('crypto-js');
const date = require('date-and-time');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
    || file.mimetype === 'image/bmp'
    || file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  }
  else {
    // does NOT throw an error!
    cb(null, false);
  }

}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

require('dotenv').config();

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(cookieParser())

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
let po = []
let sales_per = []
let sales_man = []
let isRecordInDB = false;
let attached_file;
let managers = [
  [{ Name: "Gunther Mergan", Manager: "Jean-Francois Forton" }],
  [{ Name: "Marcel VandenBerge", Manager: "Ivo Schouten" }],
  [{ Name: "Jeroen VanBerkel", Manager: "Ivo Schouten" }],
  [{ Name: "Cindy Eekels", Manager: "Andor DeVries" }],
  [{ Name: "Bob Vandenberghen", Manager: "Jean-Francois Forton" }],
  [{ Name: "Nicolas Dedobbeleer", Manager: "Jean-Francois Forton" }],
  [{ Name: "Bram Hennebert", Manager: "Jean-Francois Forton" }],
  [{ Name: "Steve Oris", Manager: "Jean-Francois Forton" }],
  [{ Name: "Christian Darmont", Manager: "Jean-Francois Forton" }],
  [{ Name: "Frank Mentens", Manager: "Jean-Francois Forton" }],
  [{ Name: "Etienne Delvosalle", Manager: "Jean-Francois Forton" }],
  [{ Name: "Jeroen Decherf", Manager: "Jean-Francois Forton" }],
  [{ Name: "Carlos DeBruijn", Manager: "Ivo Schouten" }],
  [{ Name: "Michiel Vliek", Manager: "Ivo Schouten" }],
  [{ Name: "Wouter Rook", Manager: "Ivo Schouten" }],
  [{ Name: "Arnold Wever", Manager: "Ivo Schouten" }],
  [{ Name: "Oscar Laureijs", Manager: "Ivo Schouten" }],
  [{ Name: "Kevin Markestein", Manager: "Jean-Francois Forton" }],
  [{ Name: "David Goubert", Manager: "Jean-Francois Forton" }],
  [{ Name: "Jurgen DeLeeuw", Manager: "Ivo Schouten" }],
  [{ Name: "Thomas Molendijk", Manager: "Ivo Schouten" }],
  [{ Name: "Marcelino Papperse", Manager: "Ivo Schouten" }],
  [{ Name: "Andor DeVries", Manager: "Ivo Schouten" }],
  [{ Name: "Ivo Schouten", Manager: "Patrick Diepenbach" }],
  [{ Name: "Patrick Diepenbach", Manager: "Mark Smiley" }],
  [{ Name: "Piet Verstraete", Manager: "Patrick Diepenbach" }],
  [{ Name: "Vincent Broertjes", Manager: "Patrick Diepenbach" }],
  [{ Name: "Jean-Christophe Pintiaux", Manager: "Piet Verstraete" }],
  [{ Name: "Kim Maris", Manager: "Piet Verstraete" }],
  [{ Name: "Mario Reverse", Manager: "Piet Verstraete" }],
  [{ Name: "Peter Schaekers", Manager: "Piet Verstraete" }],
  [{ Name: "Robin Roels", Manager: "Piet Verstraete" }],
  [{ Name: "Stefan Sack", Manager: "Piet Verstraete" }],
  [{ Name: "Vincent Lenain", Manager: "Piet Verstraete" }],
  [{ Name: "Vincent Pireyn", Manager: "Piet Verstraete" }],
  [{ Name: "Yves DeWaal", Manager: "Piet Verstraete" }],
  [{ Name: "Adriaan Arkeraats", Manager: "Vincent Broertjes" }],
  [{ Name: "Arno DeJager", Manager: "Vincent Broertjes" }],
  [{ Name: "Duncan DeWith", Manager: "Vincent Broertjes" }],
  [{ Name: "Ken Leysen", Manager: "Patrick Diepenbach" }],
  [{ Name: "Jean-Francois Forton", Manager: "Patrick Diepenbach" }],
  [{ Name: "Martin Van Werkhoven", Manager: "Not Found" }],
  [{ Name: "Paul Kerkhoven", Manager: "Vincent Broertjes" }],
  [{ Name: "Cedric Bicque", Manager: "Ken Leysen" }],
  [{ Name: "Christian Fonteyn", Manager: "Ken Leysen" }],
  [{ Name: "KlaasJan Bosgraaf", Manager: "Ken Leysen" }],
  [{ Name: "Ammaar Basnoe", Manager: "Ken Leysen" }],
  [{ Name: "Robert VanStraten", Manager: "Ken Leysen" }],
  [{ Name: "Sven Pieters", Manager: "Ken Leysen" }],
  [{ Name: "Niek Nijland", Manager: "Ken Leysen" }],
  [{ Name: "Geert Maes", Manager: "Stephane Depret" }],
  [{ Name: "Marleen Vangronsveld", Manager: "Stephane Depret" }],
  [{ Name: "Marlon VanZundert", Manager: "Stephane Depret" }],
  [{ Name: "Michael Soenen", Manager: "Stephane Depret" }],
  [{ Name: "Michael Tistaert", Manager: "Stephane Depret" }],
  [{ Name: "Ronald Westra", Manager: "Stephane Depret" }],
  [{ Name: "Vicky DeDecker", Manager: "Stephane Depret" }],
  [{ Name: "Christelle Marro", Manager: "Stephane Depret" }],
  [{ Name: "Frederic Barzin", Manager: "Christelle Marro" }],
  [{ Name: "Luc Claes", Manager: "Christelle Marro" }],
  [{ Name: "Marc Ghijs", Manager: "Christelle Marro" }],
  [{ Name: "Ronny Callewaert", Manager: "Christelle Marro" }],
  [{ Name: "Hendrik Pieters", Manager: "Eric Nieuwmans" }],
  [{ Name: "Malvin Puts", Manager: "Eric Nieuwmans" }],
  [{ Name: "Niels Groters", Manager: "Eric Nieuwmans" }],
  [{ Name: "Remco Rozing", Manager: "Eric Nieuwmans" }],
  [{ Name: "Eric Nieuwmans", Manager: "Stephane Depret" }]];

app.get('/', (req, res) => res.send(JSON.stringify({ myMsg: "Hello world!" })));
app.get('/clients', (req, res) => {

  client.query('SELECT * FROM biz;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      nieuw_clients.push(row.biz_name)
    }
    console.log("Fetched from DB")
  });
  setTimeout(() => {
    res.send(nieuw_clients);
  }, 250);
  nieuw_clients = []
});
app.get('/sendmail', (req, res) => res.send("Send me a JSON object via POST. (Works with Zoho now)."));
app.get('/vendor', (req, res) => {

  client.query('SELECT * FROM VENDOR;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row)
    }
    console.log("Fetched VENDORS from DB")
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = []
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {

  let plnt = 0;
  let company_code = "A";
  let order = "A";
  let destinataries = [];

  if (req.body.land === "België / Belgique") {
    company_code = "be01";
    plnt = 1110;
    switch (req.body.merk) {
      case "DeWALT – LENOX – BOSTITCH": order = "BE_DEW_L4"; break;
      case "STANLEY": order = "BE_HDT_L4"; break;
      case "FACOM": order = "BE_IAR_L4"; break;
      default: order = "ERROR"; break;
    }
  } else {
    company_code = "nl01";
    plnt = 1510;
    switch (req.body.merk) {
      case "DeWALT – LENOX – BOSTITCH": order = "NL_DEW_L4"; break;
      case "STANLEY": order = "NL_HDT_L4"; break;
      case "FACOM": order = "NL_IAR_L4"; break;
      default: order = "ERROR"; break;
    }
  }
  client.query(
    `INSERT INTO PO(
      REQUESTED_BY,
      DATUM,
      COMPANY,
      COMPANY_CODE,
      SHORT_TEXT,
      PO_QUANTITY,
      OVERALL_LIMIT,
      GR_EXECUTION_DATE,
      SBU,
      STATUS) VALUES(
        '${req.body.worker}',
        '${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}',
        '${req.body.klantnaam}',
        '${company_code}',
        '${req.body.omschijving}',
        '${'1'}',
        '${req.body.bedrag}',
        '${req.body.datum}',
        '${order}',
        '${'Pending'}')
        RETURNING id;`,
    (err, res) => {
      if (err) {
        isRecordInDB = false
        console.log(`CANNOT PO insert: ${err}`);
      }
      else {
        db_id = res.rows[0].id
        isRecordInDB = true;
        console.log(`record PO inserted #${db_id}}`)
      }
    }
  );
  // LINK Sales Rep. with zijn manager.
  managers.forEach(element => {
    if (req.body.worker === element[0].Name) {
      sales_man = element[0].Manager.split(' ')
    }
  });

  sales_per = req.body.worker.split(' ')

  req.body.potype === "Pro" ? destinataries = [`students.benelux@sbdinc.com`, `${sales_per[0]}.${sales_per[1]}@sbdinc.com`, `${sales_man[0]}.${sales_man[1]}@sbdinc.com`] : destinataries = ["Vicky.DeDecker@sbdinc.com", `${sales_per[0]}.${sales_per[1]}@sbdinc.com`, `${sales_man[0]}.${sales_man[1]}@sbdinc.com`];

  subject_klant = req.body.klantnaam.split(" ")

  console.log("request came");

  setTimeout(() => {
    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: destinataries,
      subject: `Aanvraag Ref. #${db_id} ${subject_klant[1]} ${subject_klant[2]}`,
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
  }, 1000);
});

app.get('/po', (req, res) => {

  client.query('SELECT * FROM PO;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row)
    }
    console.log("Fetched PO's from DB")
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = []
});
app.get('/archive_po', (req, res) => {

  client.query('SELECT * FROM archive_po;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row)
    }
    console.log("Fetched ARCHIVE PO's from DB")
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = []
});


app.post('/login', (req, res) => {
  console.log(`Encrypted credentials: ${req.body.usr}`)
  const credentials = CryptoJS.AES.decrypt(req.body.usr, 'h#H@k*Bjp3SrwdLM').toString(CryptoJS.enc.Utf8);
  console.log(`Decrypted: ${credentials}`)
  if (
    (credentials === `{"username":"team@sbdinc.com","password":"Mechelen2022."}`)
    ||
    (credentials === `{"username":"steve.langbeen@sbdinc.com","password":"sbdinc.2023"}`)
    ||
    (credentials === `{"username":"danielle.penninckx@sbdinc.com","password":"sbdinc2023."}`)) {
    res.send(true);
  }
  else {
    res.send(false);
  }
})

app.post('/invoice', upload.single('file'), (req, res) => {
  console.log(`Invoice came: ${req.body.u_ID}`);

  console.log(req.file)

  setTimeout(() => {
    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: [`students.benelux@sbdinc.com`, `students.benelux@sbdinc.com`, `students.benelux@sbdinc.com`],
      bcc: 'students.benelux@sbdinc.com',
      cc: 'students.benelux@sbdinc.com',
      envelope: {
        from: 'olsonperrensen@zohomail.eu',
        to: [`SBDInvoices@sbdinc.com`, `S-GTS-APBelgium@sbdinc.com`, `apnetherlands@sbdinc.com`]
    },
      subject: `Process Invoice - ${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}`,
      html: `
      Hi

In the attachment you will find the coop invoice. Please, process it.

Kind Regards.`,
      attachments: [
        {   // utf-8 string as an attachment
          filename: req.file.originalname,
          content: req.file
        }]
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
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
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
  }, 1000);

})


app.post('/clients', (req, res) => {
  // Add a client
  console.log(`New client came: "${req.body.new_client}"`);
  let isRecordInDB = false
  client.query(
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
  )
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
    if (isRecordInDB) {
      res.send("200")
    }
    else {
      res.send("500")
    }
  }, 6200);
})

app.put('/clients', (req, res) => {
  console.log(`New edit came: "${req.body.old_client}" to be replaced with "${req.body.new_client}"`)
  client.query(
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
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
    if (isRecordInDB) {
      res.send("200")
    }
    else {
      res.send("500")
    }
  }, 6200);
})

app.put('/po', (req, res) => {
  console.log(`New PO edit came: "${req.body.u_ID}" to be updated with "${req.body.new_client}" as PO status`)
  client.query(
    `UPDATE PO SET status = '${req.body.new_client}'
  where id = '${req.body.u_ID}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false
        console.log(`CANNOT PO update: ${err}`);
      }
      else {
        isRecordInDB = true;
        console.log(`PO record updated ${req.body.new_client}`)
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
    if (isRecordInDB) {
      res.send("200")
    }
    else {
      res.send("500")
    }
  }, 6200);
})

app.delete('/clients', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(`New delete came: "${RECORD_TO_DELETE}" with content "${RECORD_TO_DELETE.old_client}"`)
  client.query(
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
  )
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
    if (isRecordInDB) {
      res.send("200")
    }
    else {
      res.send("500")
    }
  }, 6200);


})
app.delete('/po', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(`New delete came: `)
  console.log(RECORD_TO_DELETE)
  console.log(`with content "${RECORD_TO_DELETE.u_ID}"`)
  client.query(
    `INSERT INTO archive_po SELECT * FROM po WHERE id = '${req.body.u_ID}';
    DELETE FROM po USING archive_po WHERE po.id = '${req.body.u_ID}';`,
    (err, res) => {
      if (err) {
        isRecordInDB = false
        console.log(`CANNOT PO delete: ${err}`);
      }
      else {
        isRecordInDB = true;
        console.log(`PO record deleted ${req.body.u_ID}`)
      }
    }
  )
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`)
    if (isRecordInDB) {
      res.send("200")
    }
    else {
      res.send("500")
    }
  }, 6200);


})

app.post('/vendor', upload.single('v_file'), (req, res) => {
  let db_id = 0;
  client.query(
    `INSERT INTO VENDOR(
      REQUESTED_BY,
      DATUM,
      KLANT,
      ADRES,
      EMAIL,
      GSM,
      VAT,
      CONTACT,
      KLANTNR,
      FILE,
      STATUS) VALUES(
        '${req.body.v_worker}',
        '${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}',
        '${req.body.v_klant}',
        '${req.body.v_adres}',
        '${req.body.v_email}',
        '${req.body.v_gsm}',
        '${req.body.v_vat}',
        '${req.body.v_contact}',
        '${req.body.v_klantnr}',
        '${req.file.originalname}',
        '${'Pending'}')
        RETURNING id;`,
    (err, res) => {
      if (err) {
        isRecordInDB = false
        console.log(`CANNOT PO insert: ${err}`);
      }
      else {
        db_id = res.rows[0].id
        isRecordInDB = true;
        console.log(`record PO inserted #${db_id}}`)
      }
    }
  );

  console.log(`Vendor came: ${req.body.v_klant}`);

  console.log(req.file)

  managers.forEach(element => {
    if (req.body.worker === element[0].Name) {
      sales_man = element[0].Manager.split(' ')
    }
  });

  sales_per = req.body.v_worker.split(' ')
  subject_klant = req.body.v_klant.split(" ")

  setTimeout(() => {
    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: [`students.benelux@sbdinc.com`, `${sales_per[0]}.${sales_per[1]}@sbdinc.com`, `${sales_man[0]}.${sales_man[1]}@sbdinc.com`],
      subject: `Vendor Aanvrag #${db_id} ${subject_klant[0]}`,
      html: `
      <ul>Requested By: ${req.body.v_worker}</ul>
      <ul>Klant: ${req.body.v_klant}</ul>
      <ul>Klant adres: ${req.body.v_adres}</ul>
      <ul>Klant email: ${req.body.v_email}</ul>
      <ul>Klant GSM: ${req.body.v_gsm}</ul>
      <ul>Klant BTW Nr.: ${req.body.v_vat}</ul>
      <ul>Klant Contactpersoon: ${req.body.v_contact}</ul>
      <ul>Klant Nr.: ${req.body.v_klantnr}</ul>
      <ul>PDF Bestand: ${req.file.originalname}</ul>`,
      attachments: [
        {   // utf-8 string as an attachment
          filename: req.file.originalname,
          content: req.file
        }]
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
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
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
  }, 1000);
});

function validateCookies(req, res, next) {
  const { cookies } = req;
  if ('session_id' in cookies) {
    console.log("Session ID Exists.")
    // Retrieve worker from .db

    // Send vars to client
  }
  else {
    console.log("No cookie")
    res.cookie('session_id', new Date().getTime(), { expires: new Date(253402300000000) });
    console.log("Cookie inserted")
  }
  next();
}

app.get('/signin', validateCookies, (req, res) => {
  res.status(200).json({ msg: 'Logged In' })
})