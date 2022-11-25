//import modules installed at the previous step. We need them to run Node.js server and send emails
const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
const date = require('date-and-time');
const multer = require('multer');
const e = require('express');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/bmp' ||
    file.mimetype === 'image/tiff' ||
    file.mimetype === 'image/tif' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    // does NOT throw an error!
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

require('dotenv').config();

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(cookieParser());

//start application server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('The server started on port 3000');
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();
let po_guy = '';
let po_shortxt = '';
let po_requested_by;
let po_datum;
let po_company;
let po_company_code;
let po_overallmt;
let po_gr;
let po_sbu;
let tmp_company_po = '';
let salesrep = '';
let nieuw_clients = [];
let nieuw_workers = [];
let po = [];
let sales_per = [];
let sales_man = [];
let isRecordInDB = false;
let attached_file;
let managers = [
  [{ NAME: 'GUNTHER MERGAN', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'MARCEL VANDENBERGE', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'JEROEN VANBERKEL', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'CINDY EEKELS', MANAGER: 'ANDOR DEVRIES' }],
  [{ NAME: 'BOB VANDENBERGHEN', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'NICOLAS DEDOBBELEER', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'BRAM HENNEBERT', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'STEVE ORIS', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'CHRISTIAN DARMONT', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'FRANK MENTENS', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'ETIENNE DELVOSALLE', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'JEROEN DECHERF', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'CARLOS DEBRUIJN', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'MICHIEL VLIEK', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'WOUTER ROOK', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'ARNOLD WEVER', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'OSCAR LAUREIJS', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'KEVIN MARKESTEIN', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'DAVID GOUBERT', MANAGER: 'JEAN-FRANCOIS FORTON' }],
  [{ NAME: 'JURGEN DELEEUW', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'THOMAS MOLENDIJK', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'MARCELINO PAPPERSE', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'ANDOR DEVRIES', MANAGER: 'IVO SCHOUTEN' }],
  [{ NAME: 'IVO SCHOUTEN', MANAGER: 'PATRICK DIEPENBACH' }],
  [{ NAME: 'PATRICK DIEPENBACH', MANAGER: 'MARK SMILEY' }],
  [{ NAME: 'PIET VERSTRAETE', MANAGER: 'PATRICK DIEPENBACH' }],
  [{ NAME: 'VINCENT BROERTJES', MANAGER: 'PATRICK DIEPENBACH' }],
  [{ NAME: 'JEAN-CHRISTOPHE PINTIAUX', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'KIM MARIS', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'MARIO REVERSE', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'PETER SCHAEKERS', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'ROBIN ROELS', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'STEFAN SACK', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'VINCENT LENAIN', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'VINCENT PIREYN', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'YVES DEWAAL', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: 'ADRIAAN ARKERAATS', MANAGER: 'VINCENT BROERTJES' }],
  [{ NAME: 'ARNO DEJAGER', MANAGER: 'VINCENT BROERTJES' }],
  [{ NAME: 'DUNCAN DEWITH', MANAGER: 'VINCENT BROERTJES' }],
  [{ NAME: 'KEN LEYSEN', MANAGER: 'PATRICK DIEPENBACH' }],
  [{ NAME: 'JEAN-FRANCOIS FORTON', MANAGER: 'PATRICK DIEPENBACH' }],
  [{ NAME: 'MARTIN VAN WERKHOVEN', MANAGER: 'NOT FOUND' }],
  [{ NAME: 'PAUL KERKHOVEN', MANAGER: 'VINCENT BROERTJES' }],
  [{ NAME: 'CEDRIC BICQUE', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'CHRISTIAN FONTEYN', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'KLAASJAN BOSGRAAF', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'AMMAAR BASNOE', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'ROBERT VANSTRATEN', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'SVEN PIETERS', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'NIEK NIJLAND', MANAGER: 'KEN LEYSEN' }],
  [{ NAME: 'GEERT MAES', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'MARLEEN VANGRONSVELD', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'MARLON VANZUNDERT', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'MICHAEL SOENEN', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'MICHAEL TISTAERT', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'RONALD WESTRA', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'VICKY DEDECKER', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'CHRISTELLE MARRO', MANAGER: 'STEPHANE DEPRET' }],
  [{ NAME: 'FREDERIC BARZIN', MANAGER: 'CHRISTELLE MARRO' }],
  [{ NAME: 'LUC CLAES', MANAGER: 'CHRISTELLE MARRO' }],
  [{ NAME: 'MARC GHIJS', MANAGER: 'CHRISTELLE MARRO' }],
  [{ NAME: 'RONNY CALLEWAERT', MANAGER: 'CHRISTELLE MARRO' }],
  [{ NAME: 'HENDRIK PIETERS', MANAGER: 'ERIC NIEUWMANS' }],
  [{ NAME: 'MALVIN PUTS', MANAGER: 'ERIC NIEUWMANS' }],
  [{ NAME: 'NIELS GROTERS', MANAGER: 'ERIC NIEUWMANS' }],
  [{ NAME: 'REMCO ROZING', MANAGER: 'ERIC NIEUWMANS' }],
  [{ NAME: 'ERIC NIEUWMANS', MANAGER: 'PATRICK DIEPENBACH' }],
];
let android = [];
let android_BASE_URL = 'https://randomuser.me/api/portraits/';
app.get('/', (req, res) => res.send(JSON.stringify({ myMsg: 'Hello world!' })));
app.get('/img', (req, res) => {
  let counter = 0;
  while (counter < 100) {
    if (counter % 2 === 0) {
      android.push({ url: `${android_BASE_URL}men/${counter}.jpg` });
    } else {
      android.push({ url: `${android_BASE_URL}women/${counter}.jpg` });
    }
    counter++;
  }
  res.send(JSON.stringify(android));
  android = []
});
app.get('/clients', (req, res) => {
  client.query('SELECT * FROM biz;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      nieuw_clients.push(row.biz_name);
    }
    console.log('Fetched from DB');
  });
  setTimeout(() => {
    res.send(nieuw_clients);
  }, 250);
  nieuw_clients = [];
});
app.get('/nonvendors', (req, res) => {
  client.query('SELECT * FROM nonvendors;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      nieuw_clients.push(row.biz_name);
    }
    console.log('Fetched from DB');
  });
  setTimeout(() => {
    res.send(nieuw_clients);
  }, 250);
  nieuw_clients = [];
});
app.get('/sendmail', (req, res) =>
  res.send('Send me a JSON object via POST. (Works with Zoho now).')
);
app.get('/vendor', (req, res) => {
  client.query('SELECT * FROM VENDOR;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row);
    }
    console.log('Fetched VENDORS from DB');
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = [];
});

app.get('/workers', (req, res) => {
  client.query('SELECT * FROM users order by CHAR_LENGTH(naam) asc;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      nieuw_workers.push(row);
    }
    console.log('Fetched workers from DB');
  });
  setTimeout(() => {
    res.send(nieuw_workers);
  }, 250);
  nieuw_workers = [];
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post('/sendmail', (req, res) => {
  let plnt = 0;
  let company_code = 'A';
  let order = 'A';
  let destinataries = [];

  if (req.body.land === 'België / Belgique') {
    company_code = 'be01';
    plnt = 1110;
    switch (req.body.merk) {
      case 'DeWALT – LENOX – BOSTITCH':
        order = 'BE_DEW_L4';
        break;
      case 'STANLEY':
        order = 'BE_HDT_L4';
        break;
      case 'FACOM':
        order = 'BE_IAR_L4';
        break;
      default:
        order = 'ERROR';
        break;
    }
  } else {
    company_code = 'nl01';
    plnt = 1510;
    switch (req.body.merk) {
      case 'DeWALT – LENOX – BOSTITCH':
        order = 'NL_DEW_L4';
        break;
      case 'STANLEY':
        order = 'NL_HDT_L4';
        break;
      case 'FACOM':
        order = 'NL_IAR_L4';
        break;
      default:
        order = 'ERROR';
        break;
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
      STATUS,
      GR,
      INVOICE) VALUES(
        '${req.body.worker}',
        '${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}',
        '${req.body.klantnaam}',
        '${company_code}',
        '${req.body.omschijving}',
        '${'1'}',
        '${req.body.bedrag}',
        '${req.body.datum}',
        '${order}',
        '${'Pending'}',
        '${'Pending'}',
        '${'Pending'}')
        RETURNING id;`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT PO insert: ${err}`);
      } else {
        db_id = res.rows[0].id;
        isRecordInDB = true;
        console.log(`record PO inserted #${db_id}`);
      }
    }
  );
  // LINK Sales Rep. with zijn manager.
  managers.forEach((element) => {
    if (req.body.worker === element[0].NAME) {
      sales_man = element[0].MANAGER.split(' ');
    }
  });

  sales_per = req.body.worker.split(' ');
  subject_klant = req.body.klantnaam.split(' ');
  console.log('request came');

  setTimeout(() => {
    const mailOptions = {
      from: 'olsonperrensen@zohomail.eu',
      to: `${sales_per[0]}.${sales_per[1]}@sbdinc.com`,
      cc: [
        `${sales_man[0]}.${sales_man[1]}@sbdinc.com`,
        'students.benelux@sbdinc.com',
      ],
      subject: `Aanvraag Ref. #${db_id} ${req.body.omschijving} ${subject_klant[1]} ${subject_klant[2]}`,
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
      <ul>Overall Limit: ${req.body.bedrag.toString().replace('.', ',')}</ul>
      <ul>Expected value: ${req.body.bedrag.toString().replace('.', ',')}</ul>
      <ul>GR Execution date: ${req.body.datum}</ul>
      <ul>G/L Account: 47020000</ul>
      <ul>Order: ${order}</ul>`,
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: 'olsonperrensen@zohomail.eu',
          pass: `${process.env.S3_BUCKET}`,
        },
      });
      transporter.sendMail(mailOptions, callback);
    };
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({ error: 'Failed to send email' });
      } else {
        console.log('Email has been sent');
        res.send(info);
      }
    });
  }, 1000);
});

// ANDROID
app.get('/po', (req, res) => {
  client.query(`SELECT * FROM PO;`, (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row);
    }
    console.log(`Fetched PO's from DB for ANDROID`);
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = [];
});

app.post('/po', (req, res) => {
  req.body.requested_by === 'MARTIN VAN'
    ? (req.body.requested_by = '%')
    : (req.body.requested_by = req.body.requested_by);

  client.query(
    `SELECT * FROM PO WHERE REQUESTED_BY LIKE '${req.body.requested_by}' or manager LIKE '${req.body.requested_by}';`,
    (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        po.push(row);
      }
      console.log(`Fetched PO's from DB by user ${req.body.requested_by}`);
    }
  );
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = [];
});

app.get('/archive_po', (req, res) => {
  client.query('SELECT * FROM archive_po;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      po.push(row);
    }
    console.log("Fetched ARCHIVE PO's from DB");
  });
  setTimeout(() => {
    res.send(po);
  }, 250);
  po = [];
});
app.get('/salesrep', (req, res) => {
  client.query('SELECT naam FROM users;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      salesrep.push(row);
    }
    console.log('Fetched salesrep from DB');
  });
  setTimeout(() => {
    res.send(salesrep);
  }, 250);
  salesrep = [];
});
app.put('/salesrepdetails', (req, res) => {
  const SALESMAN = req.body;
  console.log(`Details requested for`);
  console.log(`${SALESMAN.old_salesrep}`);

  client.query(
    `SELECT * FROM users where naam = '${SALESMAN.old_salesrep}';`,
    (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        salesrep.push(row);
      }
      console.log('Fetched salesrep from DB');
    }
  );
  setTimeout(() => {
    res.send(salesrep);
  }, 250);
  salesrep = [];
});

app.post('/login', (req, res) => {
  let user = {
    isAuthenticated: false,
    id: 0,
    username: '',
    naam: '',
    sbu: '',
    land: '',
  };
  console.log(`Encrypted tmp_credentials: ${req.body.usr}`);
  const tmp_credentials = CryptoJS.AES.decrypt(req.body.usr, 'h#H@k*Bjp3SrwdLM')
    .toString(CryptoJS.enc.Utf8)
    .split('"');
  console.log(`Decrypted: ${tmp_credentials[3].toUpperCase()}`);
  client.query(
    `select id, username, naam, sbu, land from users where username = '${tmp_credentials[3].toUpperCase()}'
    and password = '${tmp_credentials[7]}'`,
    (err, res) => {
      if (res.rowCount < 1) {
        console.log(`WRONG CREDENTIALS!`);
        user.isAuthenticated = false;
      } else {
        console.log(`VALID CREDENTIALS...`);
        user.id = res.rows[0].id;
        user.land = res.rows[0].land;
        user.naam = res.rows[0].naam;
        user.sbu = res.rows[0].sbu;
        user.username = res.rows[0].username;
        user.isAuthenticated = true;
      }
    }
  );
  setTimeout(() => {
    res.send({ u_user: user });
  }, 800);
});

app.post('/recover', (req, res) => {
  let pwd = '';
  let pwd_id;
  console.log(req.body.u_username.toUpperCase());
  client.query(
    `select id, password from users where username = '${req.body.u_username.toUpperCase()}'`,
    (err, res) => {
      if (res.rowCount < 1) {
        console.log(`WRONG CREDENTIALS!`);
        is_authenticated = false;
      } else {
        console.log(`VALID CREDENTIALS...`);
        is_authenticated = true;
        pwd = res.rows[0].password;
        pwd_id = res.rows[0].id;
        console.log(pwd);
      }
    }
  );
  console.log(`Sending email to ${req.body.u_username} to recover PWD...`);
  setTimeout(() => {
    const mailOptions = {
      from: 'olsonperrensen@zohomail.eu',
      to: `${req.body.u_username}`,
      cc: `students.benelux@sbdinc.com`,
      subject: `Password reset requested for your Sbdinc Forms Account`,
      html: `
      Hello,
      <br><br>
We recently received a request to recover the Sbdinc Forms Account ${req.body.u_username}.
<br><br>
If you sent that request, you don't need to take any action. We'll provide you with the password down below.
<br><br>
However, if you didn't make this request, please notify students.benelux@sbdinc.com.
<br><br><br>

Your reset password is <b>${pwd}</b>
<br><br>
<br><br>
You can change it here: https://olsonperrensen.github.io/form/reset?id=${pwd_id}

Thank you for your patience.

Sincerely,
The Sbdinc Forms Team
`,
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: 'olsonperrensen@zohomail.eu',
          pass: `${process.env.S3_BUCKET}`,
        },
      });
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
    };
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({ error: 'Failed to send email' });
      } else {
        console.log('Email has been sent');
        res.send(info);
      }
    });
  }, 1000);
});

app.post('/reset', (req, res) => {
  let pwd_status = 0;
  console.log(`Request came: ID ${req.body.u_id} to reset PWD.`);
  client.query(
    `update users set password = '${req.body.u_pwd}' where id = ${req.body.u_id}`,
    (err, res) => {
      if (err) {
        pwd_status = 500;
        console.log(`CANNOT RESET PWD : ${err}`);
      } else {
        pwd_status = 200;
        console.log(`PWD reset! ${req.body.u_pwd}`);
      }
    }
  );
  setTimeout(() => {
    res.send({ status: pwd_status });
  }, 800);
});

app.post('/invoice', upload.single('file'), (req, res) => {
  let company = '';
  let overall_limit = '';
  let PO = '';
  let salesrep = '';
  client.query(
    `select requested_by, company, overall_limit, status from po
    where status = '${req.body.u_ID}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT INVOICE update: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`INVOICE record updated ${req.body.u_ID}`);
        sales_per = res.rows[0].requested_by.split(' ');
        company = res.rows[0].company;
        overall_limit = res.rows[0].overall_limit;
        ref = res.rows[0].id;
        PO = res.rows[0].status;
      }
    }
  );

  client.query(
    `UPDATE PO SET INVOICE = 'Sent to AP at 
    ${date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')}'
  where status = '${req.body.u_ID}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT INVOICE update: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`INVOICE record updated ${req.body.u_ID}`);
      }
    }
  );

  console.log(`Invoice came: ${req.body.u_ID}`);

  console.log(req.file);

  setTimeout(() => {
    ref = req.body.u_ref;
    console.log(sales_per);
    const mailOptions = {
      from: 'olsonperrensen@zohomail.eu',
      to: [
        `SBDInvoices@sbdinc.com`,
        `S-GTS-APBelgium@sbdinc.com`,
        `apnetherlands@sbdinc.com`,
      ],
      cc: [
        'students.benelux@sbdinc.com',
        `${sales_per[0]}.${sales_per[1]}@sbdinc.com`,
      ],
      subject: `#${ref} Process Invoice - ${PO} - ${company}`,
      html: `
      Hi,
<br><br><br>
In the attachment you will find the coop invoice. Please, process it.
<br><br>
<ul>
      <li>Ref: ${ref}</li>
      <li>PO: ${PO}</li>
      <li>Client: ${company}</li>
      <li>Overall Limit: ${overall_limit}</li>
</ul>
<br><br><br>
Kind Regards.
<br><br>
${sales_per[0]} ${sales_per[1]}
<br><br><br>
This is an automated email. For any inquiries, please contact ${sales_per[0]}.${sales_per[1]}@sbdinc.com 
`,
      attachments: [
        {
          // utf-8 string as an attachment
          filename: req.file.originalname,
          content: req.file,
        },
      ],
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: 'olsonperrensen@zohomail.eu',
          pass: `${process.env.S3_BUCKET}`,
        },
      });
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
    };
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({ error: 'Failed to send email' });
      } else {
        console.log('Email has been sent');
        res.send(info);
      }
    });
  }, 1000);
});

app.post('/clients', (req, res) => {
  // Add a client
  console.log(`New client came: "${req.body.new_client}"`);
  let isRecordInDB = false;
  client.query(
    `INSERT INTO BIZ(biz_name) VALUES('${req.body.new_client}')`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT insert: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`record inserted ${req.body.new_client}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});

app.put('/clients', (req, res) => {
  console.log(
    `New edit came: "${req.body.old_client}" to be replaced with "${req.body.new_client}"`
  );
  client.query(
    `UPDATE BIZ SET biz_name = '${req.body.new_client}'
  where biz_name = '${req.body.old_client}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT update: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`record updated ${req.body.new_client}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});

app.put('/po', (req, res) => {
  console.log(
    `New PO edit came: "${req.body.u_ID}" to be updated with "${req.body.new_client}" as PO status`
  );
  client.query(
    `UPDATE PO SET status = '${req.body.new_client}'
  where id = '${req.body.u_ID}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT PO update: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`PO record updated ${req.body.new_client}`);
      }
    }
  );
  client.query(
    `SELECT * from PO
  where id = '${req.body.u_ID}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT PO find: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`PO Guy record found ${req.body.u_ID}`);
        po_guy = res.rows[0].requested_by.split(' ');
        po_guy = `${po_guy[0]}.${po_guy[1]}@sbdinc.com`;
        tmp_company_po = res.rows[0].company.split(' ');
        po_datum = res.rows[0].datum;
        po_company_code = res.rows[0].company_code;
        po_shortxt = res.rows[0].short_text;
        po_overallmt = res.rows[0].overall_limit;
        po_gr = res.rows[0].gr_execution_date;
        po_sbu = res.rows[0].sbu;
      }
    }
  );
  setTimeout(() => {
    const mailOptions = {
      from: 'olsonperrensen@zohomail.eu',
      to: po_guy,
      cc: `students.benelux@sbdinc.com`,
      subject: `PO #${req.body.u_ID} ${po_shortxt} ${tmp_company_po[1]} ${tmp_company_po[2]}`,
      html: `
      <p class=MsoNormal>PO <b><span style='font-size:13.5pt;font-family:"Arial",sans-serif;color:navy'>${req.body.new_client
        }<o:p></o:p></span></b></p><p class=MsoNormal><o:p>&nbsp;</o:p></p><p class=MsoNormal><o:p>&nbsp;</o:p></p><p class=MsoNormal><span lang=NL>Met vriendelijke groeten<o:p></o:p></span></p><p class=MsoNormal><span lang=NL><o:p>&nbsp;</o:p></span></p><p class=MsoNormal><span lang=NL>Students Benelux<o:p></o:p></span></p>
      <hr>
      <ul>Requested by: ${po_guy}</ul>
      <ul>Timestamp: ${po_datum}</ul>
      <ul>Company: ${tmp_company_po.toString().replace(',', ' ')}</ul>
      <ul>Purch. Org.: 0001</ul>
      <ul>Purch. Group: LV4</ul>
      <ul>Company Code: ${po_company_code}</ul>
      <ul>A: f</ul>
      <ul>I: d</ul>
      <ul>Short text: ${po_shortxt}</ul>
      <ul>PO Quantity: 1</ul>
      <ul>Matl Group: level4</ul>
      <ul>Plnt: ${po_company_code === 'be01' ? '1110' : '1510'}</ul>
      <ul>Overall Limit: ${po_overallmt}</ul>
      <ul>Expected value: ${po_overallmt}</ul>
      <ul>GR Execution date: ${po_gr}</ul>
      <ul>G/L Account: 47020000</ul>
      <ul>Order: ${po_sbu}</ul>
      `,
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: 'olsonperrensen@zohomail.eu',
          pass: `${process.env.S3_BUCKET}`,
        },
      });
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
    };
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.send('500');
      } else {
        console.log('Email has been sent');
        res.send('200');
      }
    });
  }, 1000);
});
app.put('/salesrep', (req, res) => {
  console.log(
    `New SalesRep edit came: "${req.body.old_salesrep}" to be updated with "${req.body.new_salesrep}" as name and all extra info...`
  );
  client.query(
    `UPDATE users SET username = '${req.body.new_email}', password= '${req.body.new_pwd}', naam = '${req.body.new_salesrep}', sbu = '${req.body.new_sbu}', land = '${req.body.new_land}'
  where naam = '${req.body.old_salesrep}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT SalesRep update: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`SalesRep record updated ${req.body.new_salesrep}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});

app.delete('/clients', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(
    `New delete came: "${RECORD_TO_DELETE}" with content "${RECORD_TO_DELETE.old_client}"`
  );
  client.query(
    `DELETE FROM BIZ WHERE biz_name = '${req.body.old_client}'`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT delete: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`record deleted ${req.body.old_client}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});
app.delete('/po', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(`New delete came: `);
  console.log(RECORD_TO_DELETE);
  console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);
  client.query(
    `INSERT INTO archive_po SELECT * FROM po WHERE id = '${req.body.u_ID}';
    DELETE FROM po USING archive_po WHERE po.id = '${req.body.u_ID}';`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT PO delete: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`PO record deleted ${req.body.u_ID}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});
app.delete('/salesrep', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(`New delete came for Sales Rep: `);
  console.log(RECORD_TO_DELETE);
  console.log(`with content "${RECORD_TO_DELETE.u_salesrep}"`);
  client.query(
    `DELETE FROM users WHERE naam = '${req.body.u_salesrep}';`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT SALES REP delete: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`SALES REP record deleted ${req.body.u_salesrep}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});

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
        isRecordInDB = false;
        console.log(`CANNOT PO insert: ${err}`);
      } else {
        db_id = res.rows[0].id;
        isRecordInDB = true;
        console.log(`record PO inserted #${db_id}`);
      }
    }
  );

  console.log(`Vendor came: ${req.body.v_klant}`);

  console.log(req.file);

  managers.forEach((element) => {
    if (req.body.v_worker === element[0].NAME) {
      sales_man = element[0].MANAGER.split(' ');
    }
  });

  sales_per = req.body.v_worker.split(' ');
  subject_klant = req.body.v_klant.split(' ');

  setTimeout(() => {
    const mailOptions = {
      from: 'olsonperrensen@zohomail.eu',
      to: [
        `students.benelux@sbdinc.com`,
        `${sales_per[0]}.${sales_per[1]}@sbdinc.com`,
      ],
      cc: `${sales_man[0]}.${sales_man[1]}@sbdinc.com`,
      subject: `Vendor Aanvraag #${db_id} ${subject_klant[0]}`,
      html: `
      <ul>Requested By: ${req.body.v_worker}</ul>
      <ul>Klant: ${req.body.v_klant}</ul>
      <ul>Klant adres: ${req.body.v_adres}</ul>
      <ul>Klant email: ${req.body.v_email}</ul>
      <ul>Klant GSM: ${req.body.v_gsm}</ul>
      <ul>Klant BTW Nr.: ${req.body.v_vat}</ul>
      <ul>Klant Contactpersoon: ${req.body.v_contact}</ul>
      <ul>Klant Nr.: ${req.body.v_klantnr}</ul>
      <ul>PDF Bestand: ${req.file.originalname}</ul>
      <ul>Reason: Level 4 vendor, for customer: ${req.body.v_klant}, forum contribution</ul>
      <ul>Special instructions: payment terms- payable immediately, for customer: ${req.body.v_klant} level4 vendor</ul>`,
      attachments: [
        {
          // utf-8 string as an attachment
          filename: req.file.originalname,
          content: req.file,
        },
      ],
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: 'olsonperrensen@zohomail.eu',
          pass: `${process.env.S3_BUCKET}`,
        },
      });
      setTimeout(() => {
        transporter.sendMail(mailOptions, callback);
      }, 3000);
    };
    let user = req.body;
    sendMail(user, (err, info) => {
      if (err) {
        console.log(err);
        res.status(400);
        res.send({ error: 'Failed to send email' });
      } else {
        console.log('Email has been sent');
        res.send(info);
      }
    });
  }, 1000);
});

app.put('/gr', (req, res) => {
  const RECORD_TO_UPDATE = req.body;
  console.log(`New GR update came: `);
  console.log(RECORD_TO_UPDATE);
  console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);
  client.query(
    `UPDATE po SET gr = '${req.body.new_gr}' WHERE id = '${req.body.u_ID}';`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT PO delete: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`GR record updated ${req.body.u_ID}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});
app.delete('/gr', (req, res) => {
  const RECORD_TO_DELETE = req.body;
  console.log(`New GR delete came: `);
  console.log(RECORD_TO_DELETE);
  console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);
  client.query(
    `DELETE FROM po WHERE po.id = '${req.body.u_ID}';`,
    (err, res) => {
      if (err) {
        isRecordInDB = false;
        console.log(`CANNOT GR delete: ${err}`);
      } else {
        isRecordInDB = true;
        console.log(`GR record deleted ${req.body.u_ID}`);
      }
    }
  );
  setTimeout(() => {
    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send('200');
    } else {
      res.send('500');
    }
  }, 6200);
});

function validateCookies(req, res, next) {
  const { cookies } = req;
  if ('session_id' in cookies) {
    console.log('Session ID Exists.');
    // Retrieve worker from .db

    // Send vars to client
  } else {
    console.log('No cookie');
    res.cookie('session_id', new Date().getTime(), {
      expires: new Date(253402300000000),
    });
    console.log('Cookie inserted');
  }
  next();
}

app.get('/signin', validateCookies, (req, res) => {
  res.status(200).json({ msg: 'Logged In' });
});
