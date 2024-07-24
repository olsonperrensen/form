//import modules installed at the previous step. We need them to run Node.js server and send emails
const { Client } = require("pg");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const date = require("date-and-time");
const multer = require("multer");
const e = require("express");
const jwt = require("jsonwebtoken");
const Tesseract = require("tesseract.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const secretKey =
  process.env.JWT_GEHEIM || "9__BvprarHTGluMH$XZHO0JRcGQAvsT-EFIlsOBetoxs#4";
let token;

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/bmp" ||
    file.mimetype === "image/tiff" ||
    file.mimetype === "image/tif" ||
    file.mimetype === "image/gif"
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

require("dotenv").config();

// create a new Express application instance
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(cookieParser());

//start application server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`The server started on port ${process.env.PORT}`);
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();
const util = require("util");
const query = util.promisify(client.query).bind(client);
let po_guy = "";
let po_shortxt = "";
let po_requested_by;
let po_datum;
let po_company;
let po_company_code;
let po_overallmt;
let po_gr;
let po_sbu;
let tmp_company_po = "";
let salesrep = "";
let nieuw_clients = [];
let nieuw_workers = [];
let po = [];
let sales_per = [];
let sales_man = [];
let dbSalesManager = "";
let isRecordInDB = false;
let attached_file;
let managers = [
  [{ NAME: "GUNTHER MERGAN", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "MARCEL VANDENBERGE", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "JEROEN VANBERKEL", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "CINDY EEKELS", MANAGER: "ANDOR DEVRIES" }],
  [{ NAME: "BOB VANDENBERGHEN", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "NICOLAS DEDOBBELEER", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "BRAM HENNEBERT", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "STEVE ORIS", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "CHRISTIAN DARMONT", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "FRANK MENTENS", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "ETIENNE DELVOSALLE", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "JEROEN DECHERF", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "CARLOS DEBRUIJN", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "MICHIEL VLIEK", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "WOUTER ROOK", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "ARNOLD WEVER", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "OSCAR LAUREIJS", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "KEVIN MARKESTEIN", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "DAVID GOUBERT", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "JURGEN DELEEUW", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "THOMAS MOLENDIJK", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "MARCELINO PAPPERSE", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "ANDOR DEVRIES", MANAGER: "IVO SCHOUTEN" }],
  [{ NAME: "IVO SCHOUTEN", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "PATRICK DIEPENBACH", MANAGER: "MARK SMILEY" }],
  [{ NAME: "PIET VERSTRAETE", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "VINCENT BROERTJES", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "JEAN-CHRISTOPHE PINTIAUX", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "KIM MARIS", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "MARIO REVERSE", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "PETER SCHAEKERS", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "ROBIN ROELS", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "STEFAN SACK", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "VINCENT LENAIN", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "VINCENT PIREYN", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "YVES DEWAAL", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "ADRIAAN ARKERAATS", MANAGER: "VINCENT BROERTJES" }],
  [{ NAME: "ARNO DEJAGER", MANAGER: "VINCENT BROERTJES" }],
  [{ NAME: "DUNCAN DEWITH", MANAGER: "VINCENT BROERTJES" }],
  [{ NAME: "KEN LEYSEN", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "JEAN-FRANCOIS FORTON", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "MARTIN VAN WERKHOVEN", MANAGER: "NOT FOUND" }],
  [{ NAME: "PAUL KERKHOVEN", MANAGER: "VINCENT BROERTJES" }],
  [{ NAME: "CEDRIC BICQUE", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "CHRISTIAN FONTEYN", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "KLAASJAN BOSGRAAF", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "AMMAAR BASNOE", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "ROBERT VANSTRATEN", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "SVEN PIETERS", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "NIEK NIJLAND", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "GEERT MAES", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "MARLEEN VANGRONSVELD", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "MARLON VANZUNDERT", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "MICHAEL SOENEN", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "MICHAEL TISTAERT", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "RONALD WESTRA", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "VICKY DEDECKER", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "CHRISTELLE MARRO", MANAGER: "STEPHANE DEPRET" }],
  [{ NAME: "FREDERIC BARZIN", MANAGER: "CHRISTELLE MARRO" }],
  [{ NAME: "LUC CLAES", MANAGER: "CHRISTELLE MARRO" }],
  [{ NAME: "MARC GHIJS", MANAGER: "CHRISTELLE MARRO" }],
  [{ NAME: "RONNY CALLEWAERT", MANAGER: "CHRISTELLE MARRO" }],
  [{ NAME: "HENDRIK PIETERS", MANAGER: "ERIC NIEUWMANS" }],
  [{ NAME: "MALVIN PUTS", MANAGER: "ERIC NIEUWMANS" }],
  [{ NAME: "NIELS GROTERS", MANAGER: "ERIC NIEUWMANS" }],
  [{ NAME: "REMCO ROZING", MANAGER: "ERIC NIEUWMANS" }],
  [{ NAME: "BERT VANBAEL", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "NICO HULSHOF", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "GERAURD COUROUBLE", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "ROBBY CATTELLION", MANAGER: "KEN LEYSEN" }],
  [{ NAME: "LUDWIG VANHAUTE", MANAGER: "HILDE VERBEEK" }],
  [{ NAME: 'RIYA JOGANI', MANAGER: 'PIET VERSTRAETE' }],
  [{ NAME: "DANIELLE PENNINCKX", MANAGER: "PIET VERSTRAETE" }],
  [{ NAME: "ERIC NIEUWMANS", MANAGER: "PATRICK DIEPENBACH" }],
  [{ NAME: "FREDERIC VANNIEUWENHOVEN", MANAGER: "JEAN-FRANCOIS FORTON" }],
  [{ NAME: "BEN LIEKENS", MANAGER: "JEAN-FRANCOIS FORTON" }],
];
let android = [];
let android_BASE_URL = "https://randomuser.me/api/portraits/";
app.get("/", authenticateToken, (req, res) =>
  res.send(JSON.stringify({ myMsg: "Hello world!" }))
);
app.get("/img", (req, res) => {
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
  android = [];
});

app.get("/clients", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT * FROM biz;");
    const nieuw_clients = [];

    for (let row of result.rows) {
      nieuw_clients.push(row.biz_name);
    }

    console.log("Fetched from DB");
    res.send(nieuw_clients);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/log", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT company_code, requested_by, u.manager, u.sbu, datum, company, short_text, overall_limit, status, gr, invoice FROM po JOIN users u ON po.requested_by = u.naam ORDER BY datum DESC;"
    );
    const nieuw_clients = [];

    for (let row of result.rows) {
      let sbu = "";
      switch (row.sbu) {
        case "DeWALT – LENOX – BOSTITCH":
          sbu = "DW";
          break;
        case "STANLEY":
          sbu = "HDT";
          break;
        case "FACOM":
          sbu = "IAR";
          break;
        default:
          sbu = "ERROR";
          break;
      }

      // EXCEL LOG CTRL C + CTRL V
      nieuw_clients.push(
        `${row.company_code.toUpperCase()}\tMa\t${row.requested_by
          .split(" ")
          .map((n) => n[0])
          .join("")}\t${row.manager
            .split(" ")
            .map((n) => n[0])
            .join("")}\tPRO\t${sbu}\t${row.datum.split(" ")[0]}\t${row.datum.split(" ")[0].split("/")[0]
        }\t${row.company.split(" ").at(-1)}\t${row.company}\t${row.short_text
        }\tYES\t${String(row.overall_limit).replace(".", ",")}\t${String(
          row.overall_limit
        ).replace(".", ",")}\t${row.status}\t${row.gr}\t\t\t\t${row.invoice !== "Pending" ? row.invoice.split(" ")[8] : row.invoice
        }\n`
      );
    }

    console.log("Fetched from DB");
    res.send(nieuw_clients);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/vendor", authenticateToken, async (req, res) => {
  try {
    const result = await query("SELECT * FROM VENDOR;");
    const po = [];

    for (let row of result.rows) {
      po.push(row);
    }

    console.log("Fetched VENDORS from DB");
    res.send(po);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/workers", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM users ORDER BY CHAR_LENGTH(naam) ASC;"
    );
    const nieuw_workers = [];

    for (let row of result.rows) {
      nieuw_workers.push(row);
    }

    console.log("Fetched workers from DB");
    res.send(nieuw_workers);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {
  let cc1 = req.body.cc1 != undefined ? req.body.cc1 : "";
  let cc2 = req.body.cc2 != undefined ? req.body.cc2 : "";
  let split = req.body.merk_2 != "" && req.body.bedrag_2 != "" ? true : false;
  let som =
    req.body.bedrag_2 != ""
      ? parseFloat(req.body.bedrag) + parseFloat(req.body.bedrag_2)
      : "";
  som = req.body.bedrag_3 != "" ? som + parseFloat(req.body.bedrag_3) : "";
  let plnt = 0;
  let company_code = "A";
  let order = "A";
  let order_2 = "A";
  let order_3 = "A";
  let destinataries = [];

  if (req.body.land === "België / Belgique") {
    company_code = "be01";
    plnt = 1110;
    switch (req.body.merk) {
      case "DeWALT – LENOX – BOSTITCH":
        order = "BE_DEW_L4";
        break;
      case "STANLEY":
        order = "BE_HDT_L4";
        break;
      case "FACOM":
        order = "BE_IAR_L4";
        break;
      default:
        order = "ERROR";
        break;
    }
    switch (req.body.merk_2) {
      case "DeWALT – LENOX – BOSTITCH":
        order_2 = "BE_DEW_L4";
        break;
      case "STANLEY":
        order_2 = "BE_HDT_L4";
        break;
      case "FACOM":
        order_2 = "BE_IAR_L4";
        break;
      default:
        order_2 = "";
        break;
    }
    switch (req.body.merk_3) {
      case "DeWALT – LENOX – BOSTITCH":
        order_3 = "BE_DEW_L4";
        break;
      case "STANLEY":
        order_3 = "BE_HDT_L4";
        break;
      case "FACOM":
        order_3 = "BE_IAR_L4";
        break;
      default:
        order_3 = "";
        break;
    }
  } else {
    company_code = "nl01";
    plnt = 1510;
    switch (req.body.merk) {
      case "DeWALT – LENOX – BOSTITCH":
        order = "NL_DEW_L4";
        break;
      case "STANLEY":
        order = "NL_HDT_L4";
        break;
      case "FACOM":
        order = "NL_IAR_L4";
        break;
      default:
        order = "ERROR";
        break;
    }
    switch (req.body.merk_2) {
      case "DeWALT – LENOX – BOSTITCH":
        order_2 = "NL_DEW_L4";
        break;
      case "STANLEY":
        order_2 = "NL_HDT_L4";
        break;
      case "FACOM":
        order_2 = "NL_IAR_L4";
        break;
      default:
        order_2 = "";
        break;
    }
    switch (req.body.merk_3) {
      case "DeWALT – LENOX – BOSTITCH":
        order_3 = "NL_DEW_L4";
        break;
      case "STANLEY":
        order_3 = "NL_HDT_L4";
        break;
      case "FACOM":
        order_3 = "NL_IAR_L4";
        break;
      default:
        order_3 = "";
        break;
    }
  }
  // LINK Sales Rep. with zijn manager.
  managers.forEach((element) => {
    if (req.body.worker === element[0].NAME) {
      sales_man = element[0].MANAGER.split(" ");
      dbSalesManager = element[0].MANAGER;
    }
  });
  client.query(
    `INSERT INTO PO(
      REQUESTED_BY,
      DATUM,
      COMPANY,
      COMPANY_CODE,
      SHORT_TEXT,
      PO_QUANTITY,
      OVERALL_LIMIT,
      OVERALL_LIMIT_2,
      OVERALL_LIMIT_3,
      GR_EXECUTION_DATE,
      SBU,
      SBU_2,
      SBU_3,
      STATUS,
      GR,
      INVOICE,
      HOEBETAALD,
      MANAGER) VALUES(
        '${req.body.worker}',
        '${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")}',
        '${req.body.klantnaam}',
        '${company_code}',
        '${req.body.omschijving}',
        '${"1"}',
        '${req.body.bedrag}',
        '${req.body.bedrag_2}',
        '${req.body.bedrag_3}',
        '${req.body.datum}',
        '${order}',
        '${order_2}',
        '${order_3}',
        '${"Pending"}',
        '${"Pending"}',
        '${"Pending"}',
        '${req.body.betal}',
        '${dbSalesManager}')
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

  sales_per = req.body.worker.split(" ");
  subject_klant = req.body.klantnaam.split(" ");
  console.log("request came");

  setTimeout(() => {
    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: `${sales_per[0]}.${sales_per[1]}@sbdinc.com`,
      cc: [
        `${sales_man[0]}.${sales_man[1]}@sbdinc.com`,
        "students.benelux@sbdinc.com",
        cc1,
        cc2,
      ],
      subject: !split
        ? `Aanvraag Ref. #${db_id} ${req.body.omschijving} ${subject_klant[1]} ${subject_klant[2]}`
        : `Split Ref. #${db_id} ${req.body.omschijving} ${subject_klant[1]} ${subject_klant[2]}`,
      html: !split
        ? `
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
      <ul>Overall Limit: ${req.body.bedrag.toString().replace(".", ",")}</ul>
      <ul>Expected value: ${req.body.bedrag.toString().replace(".", ",")}</ul>
      <ul>GR Execution date: ${req.body.datum}</ul>
      <ul>G/L Account: 47020000</ul>
      <ul>Order: ${order}</ul>
      `
        : `<ul>Requested by: ${req.body.worker}</ul>
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
      <ul>First Limit: ${req.body.bedrag.toString().replace(".", ",")}</ul>
      <ul>Second Limit: ${req.body.bedrag_2.toString().replace(".", ",")}</ul>
      <ul>Third Limit: ${req.body.bedrag_3.toString().replace(".", ",")}</ul>
      <ul>Combined value: ${som.toString().replace(".", ",")}</ul>
      <ul>GR Execution date: ${req.body.datum}</ul>
      <ul>G/L Account: 47020000</ul>
      <ul>First Order: ${order}</ul>
      <ul>Second Order: ${order_2}</ul>
      <ul>Third Order: ${order_3}</ul>`,
    };
    const sendMail = (user, callback) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu", // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: "olsonperrensen@zohomail.eu",
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
        res.send({ error: "Failed to send email" });
      } else {
        console.log("Email has been sent");
        res.send(info);
      }
    });
  }, 1000);
});

// ANDROID
app.get("/po", authenticateToken, (req, res) => {
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

app.post("/po", authenticateToken, async (req, res) => {
  try {
    let requestedBy =
      req.body.requested_by === "MARTIN VAN" ? "%" : req.body.requested_by;

    const queryText = `SELECT * FROM PO WHERE REQUESTED_BY LIKE '${requestedBy}' or manager LIKE '${requestedBy}'
    ORDER BY ID DESC;`;
    const result = await query(queryText);

    const po = [];
    for (let row of result.rows) {
      po.push(row);
    }

    console.log(`Fetched PO's from DB by user ${requestedBy}`);
    res.send(po);
  } catch (err) {
    throw err;
  }
});

app.post("/filterpo", authenticateToken, async (req, res) => {
  console.log(`filter req came in with body: ${req.body}`);
  try {
    let requestedBy =
      req.body.requested_by === "MARTIN VAN" ? "%" : req.body.requested_by;
    let jaar = req.body.jaar ?? "";
    let biz = req.body.biz ?? "";

    console.log(
      `Got the following information: ${requestedBy}, filtering year: ${jaar}, biz: ${biz} (${biz.length} chars long)`
    );

    const queryText = `select * from PO
         WHERE (REQUESTED_BY LIKE '${requestedBy}' or manager LIKE '${requestedBy}')
         AND EXTRACT(YEAR FROM TO_TIMESTAMP(datum, 'YYYY/MM/DD HH24:MI:SS')) = '${jaar}'
         AND company like '%${biz}%'
order by id desc;`;
    const result = await query(queryText);

    const po = [];
    for (let row of result.rows) {
      po.push(row);
    }

    console.log(`Fetched Filtered PO's from DB by user ${requestedBy}`);
    res.send(po);
  } catch (err) {
    throw err;
  }
});

app.post("/archive_po", authenticateToken, async (req, res) => {
  try {
    let requestedBy =
      req.body.requested_by === "MARTIN VAN" ? "%" : req.body.requested_by;

    const queryText = `SELECT * FROM APO WHERE REQUESTED_BY LIKE '${requestedBy}' or manager LIKE '${requestedBy}'
    ORDER BY ID DESC;`;
    const result = await query(queryText);

    const po = [];
    for (let row of result.rows) {
      po.push(row);
    }

    console.log(`Fetched PO's from DB by user ${requestedBy}`);
    res.send(po);
  } catch (err) {
    throw err;
  }
});

app.get("/salesrep", async (req, res) => {
  try {
    const queryText = "SELECT naam FROM users;";
    const result = await query(queryText);

    const salesrep = [];
    for (let row of result.rows) {
      salesrep.push(row);
    }

    console.log("Fetched salesrep from DB");
    res.send(salesrep);
  } catch (err) {
    throw err;
  }
});

app.put("/salesrepdetails", authenticateToken, async (req, res) => {
  try {
    const SALESMAN = req.body;
    console.log(`Details requested for`);
    console.log(`${SALESMAN.old_salesrep}`);

    const queryText = `SELECT * FROM users where naam = '${SALESMAN.old_salesrep}';`;
    const result = await query(queryText);

    const salesrep = [];
    for (let row of result.rows) {
      salesrep.push(row);
    }

    console.log("Fetched salesrep from DB");
    res.send(salesrep);
  } catch (err) {
    throw err;
  }
});

app.post("/login", async (req, res) => {
  try {
    let user = {
      isAuthenticated: false,
      id: 0,
      username: "",
      naam: "",
      sbu: "",
      land: "",
    };
    console.log(`Encrypted tmp_credentials: ${req.body.usr}`);
    const tmp_credentials = CryptoJS.AES.decrypt(
      req.body.usr,
      "h#H@k*Bjp3SrwdLM"
    )
      .toString(CryptoJS.enc.Utf8)
      .split('"');
    console.log(tmp_credentials);
    console.log(`Decrypted: ${tmp_credentials[3].toUpperCase()}`);

    const queryText = `select id, username, naam, sbu, land from users where username = '${tmp_credentials[3].toUpperCase()}' and password = '${tmp_credentials[7]
      }'`;
    const result = await query(queryText);

    if (result.rowCount < 1) {
      console.log(`WRONG CREDENTIALS!`);
      user.isAuthenticated = false;
    } else {
      console.log(`VALID CREDENTIALS...`);
      user.id = result.rows[0].id;
      user.land = result.rows[0].land;
      user.naam = result.rows[0].naam;
      user.sbu = result.rows[0].sbu;
      user.username = result.rows[0].username;
      user.isAuthenticated = true;
      token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
    }

    if (user.isAuthenticated) {
      console.log("Proceeding to homepage...");
      res.send({ u_user: user, token: token });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    throw err;
  }
});

app.post("/recover", async (req, res) => {
  let pwd = "";
  let pwd_id;
  console.log(req.body.u_username.toUpperCase());

  try {
    const selectQuery = `SELECT id, password FROM users WHERE username = '${req.body.u_username.toUpperCase()}'`;
    const result = await client.query(selectQuery);

    if (result.rowCount < 1) {
      console.log(`WRONG CREDENTIALS!`);
      res.status(401);
      res.send({ error: "Invalid credentials" });
      return;
    }

    console.log(`VALID CREDENTIALS...`);
    pwd = result.rows[0].password;
    pwd_id = result.rows[0].id;
    console.log(pwd);

    console.log(`Sending email to ${req.body.u_username} to recover PWD...`);

    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
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

    const sendMail = async (user) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu",
        port: 465,
        secure: true,
        auth: {
          user: "olsonperrensen@zohomail.eu",
          pass: `${process.env.S3_BUCKET}`,
        },
      });

      await transporter.sendMail(mailOptions);
      console.log("Email has been sent");
      res.send({ response: "250 Message received" });
    };

    await sendMail(req.body);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ error: "Failed to send email" });
  }
});

app.post("/reset", async (req, res) => {
  try {
    let pwd_status = 0;
    console.log(`Request came: ID ${req.body.u_id} to reset PWD.`);

    const queryText = `update users set password = '${req.body.u_pwd}' where id = ${req.body.u_id}`;
    await query(queryText);

    pwd_status = 200;
    console.log(`PWD reset! ${req.body.u_pwd}`);

    res.send({ status: pwd_status });
  } catch (err) {
    pwd_status = 500;
    console.log(`CANNOT RESET PWD: ${err}`);

    res.send({ status: pwd_status });
  }
});

// LEGACY OCR READER v0.1 --- DEPRECATED as of 17/7/'23 -> USE FASTAPI's TESSERACT INSTEAD
// app.post('/ocr', upload.single('mfile'), async (req, res) => {
//   let final_txt

//   const worker = await Tesseract.createWorker({
//     logger: m => console.log(m)
//   });

//   const PNGPATH = Date.now() + req.file.originalname
//   const path = require('path');
//   const pdf = require('pdf-poppler');

//   let file = `./uploads/${req.file.filename}`

//   let opts = {
//     format: 'png',
//     out_dir: path.dirname(file),
//     out_prefix: PNGPATH,
//     page: null
//   }

//   pdf.convert(file, opts)
//     .then(response => {
//       console.log('Successfully converted');
//       // OCR GOES HERE
//       (async () => {
//         await worker.loadLanguage('nld');
//         await worker.initialize('nld');
//         const { data: { text } } = await worker.recognize(`./uploads/${PNGPATH}-1.png`);
//         console.log(text);
//         final_txt = text
//         res.send(final_txt)
//         await worker.terminate();
//       })();
//     })
//     .catch(error => {
//       console.error(error);
//     })
// })

app.post(
  "/invoice",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    let company = "";
    let overall_limit = "";
    let PO = "";
    let salesrep = "";
    let betal = "";
    let pmt = "";

    try {
      const selectQuery = `SELECT requested_by, company, overall_limit, overall_limit_2, overall_limit_3,HOEBETAALD, 
      status FROM po WHERE status = '${req.body.u_ID}'`;

      const result = await client.query(selectQuery);

      if (result.rowCount < 1) {
        console.log(`No record found for INVOICE update`);
        res.status(404);
        res.send({ error: "Record not found" });
        return;
      }

      console.log(`INVOICE record updated ${req.body.u_ID}`);
      sales_per = result.rows[0].requested_by.split(" ");
      company = result.rows[0].company;
      overall_limit =
        parseFloat(result.rows[0].overall_limit_3) +
        parseFloat(result.rows[0].overall_limit_2) +
        parseFloat(result.rows[0].overall_limit);
      ref = result.rows[0].id;
      PO = result.rows[0].status;
      betal = result.rows[0].hoebetaald;
      if (betal == "Uitbetaald") {
        pmt = "Invoice should be paid out to the vendor";
      } else if (betal == "Mindering (openstaande factuur)") {
        pmt = "The vendor will offset the value from outstanding-invoice";
      } else {
        pmt = "Unspecified. Consult.";
      }

      const updateQuery = `UPDATE po SET invoice = '${req.body.u_fnr
        } Sent to AP at 
      ${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")}' WHERE status = '${req.body.u_ID
        }'`;

      await client.query(updateQuery);

      console.log(`Invoice came: ${req.body.u_ID}`);
      console.log(req.file);

      ref = req.body.u_ref;
      const mailOptions = {
        from: "olsonperrensen@zohomail.eu",
        to: [
          "SBDInvoices@sbdinc.com",
          "S-GTS-APBelgium@sbdinc.com",
          "apnetherlands@sbdinc.com",
          "SVC-CRP-SBDe-Invoices@sbdinc.com",
        ],
        cc: [
          "students.benelux@sbdinc.com",
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
          <li>Invoice number: ${req.body.u_fnr}</li>
          <li>Invoice date: ${req.body.u_fdatum}</li>
          <li>Payment method: ${pmt}</li>
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
            filename: `${PO}_${req.file.originalname}`,
            content: req.file,
          },
        ],
      };

      const sendMail = async (options) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.zoho.eu",
          port: 465,
          secure: true,
          auth: {
            user: "olsonperrensen@zohomail.eu",
            pass: `${process.env.S3_BUCKET}`,
          },
        });

        await transporter.sendMail(options);
        console.log("Email has been sent");
        res.send({ response: "250 Message received" });
      };

      await sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      res.status(500);
      res.send({ error: "Failed to send email" });
    }
  }
);

app.post("/clients", authenticateToken, async (req, res) => {
  try {
    // Add a client
    console.log(`New client came: "${req.body.new_client}"`);
    let isRecordInDB = false;

    const queryText = `INSERT INTO BIZ(biz_name) VALUES('${req.body.new_client}')`;
    await query(queryText);

    isRecordInDB = true;
    console.log(`Record inserted: ${req.body.new_client}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    if (isRecordInDB) {
      res.send("200");
    } else {
      res.send("500");
    }
  } catch (err) {
    isRecordInDB = false;
    console.log(`CANNOT insert: ${err}`);
    res.send("500");
  }
});

app.put("/clients", authenticateToken, async (req, res) => {
  try {
    console.log(
      `New edit came: "${req.body.old_client}" to be replaced with "${req.body.new_client}"`
    );

    const queryText = `UPDATE BIZ SET biz_name = '${req.body.new_client}' WHERE biz_name = '${req.body.old_client}'`;
    await query(queryText);

    console.log(`Record updated: ${req.body.new_client}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT update: ${err}`);
    res.send("500");
  }
});

app.put("/po", authenticateToken, async (req, res) => {
  console.log(
    `New PO edit came: "${req.body.u_ID}" to be updated with "${req.body.new_client}" as PO status`
  );

  try {
    // Update PO status
    await query(
      `UPDATE PO SET status = '${req.body.new_client}' where id = '${req.body.u_ID}'`
    );

    // Fetch PO details
    const poDetails = await query(
      `SELECT * from PO where id = '${req.body.u_ID}'`
    );
    po_guy = poDetails.rows[0].requested_by.split(" ");
    // Fixes empty destinatary
    po_guy = `${po_guy[0]}.${po_guy[1]}@sbdinc.com`;
    const tmp_company_po = poDetails.rows[0].company.split(" ");
    const po_datum = poDetails.rows[0].datum;
    const po_company_code = poDetails.rows[0].company_code;
    const po_shortxt = poDetails.rows[0].short_text;
    const po_overallmt =
      parseFloat(poDetails.rows[0].overall_limit_3) +
      parseFloat(poDetails.rows[0].overall_limit_2) +
      parseFloat(poDetails.rows[0].overall_limit);
    const po_gr = poDetails.rows[0].gr_execution_date;
    const po_sbu = poDetails.rows[0].sbu;
    console.log(`PO Guy ${po_guy} record found ${req.body.u_ID}`);
    // Wait for a specified duration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: po_guy,
      cc: `students.benelux@sbdinc.com`,
      subject: `PO #${req.body.u_ID} ${po_shortxt} ${tmp_company_po[1]} ${tmp_company_po[2]}`,
      html: `
      <p class=MsoNormal>PO <b><span style='font-size:13.5pt;font-family:"Arial",sans-serif;color:navy'>${req.body.new_client
        }<o:p></o:p></span></b></p><p class=MsoNormal><o:p>&nbsp;</o:p></p><p class=MsoNormal><o:p>&nbsp;</o:p></p><p class=MsoNormal><span lang=NL>Met vriendelijke groeten / Bien à vous<o:p></o:p></span></p><p class=MsoNormal><span lang=NL><o:p>&nbsp;</o:p></span></p><p class=MsoNormal><span lang=NL>Students Benelux<o:p></o:p></span></p>
      <hr>
      <ul>Requested by: ${po_guy}</ul>
      <ul>Timestamp: ${po_datum}</ul>
      <ul>Company: ${tmp_company_po.toString().replace(",", " ")}</ul>
      <ul>Purch. Org.: 0001</ul>
      <ul>Purch. Group: LV4</ul>
      <ul>Company Code: ${po_company_code}</ul>
      <ul>A: f</ul>
      <ul>I: d</ul>
      <ul>Short text: ${po_shortxt}</ul>
      <ul>PO Quantity: 1</ul>
      <ul>Matl Group: level4</ul>
      <ul>Plnt: ${po_company_code === "be01" ? "1110" : "1510"}</ul>
      <ul>Overall Limit: ${po_overallmt.toString().replace(".", ",")}</ul>
      <ul>Expected value: ${po_overallmt.toString().replace(".", ",")}</ul>
      <ul>GR Execution date: ${po_gr}</ul>
      <ul>G/L Account: 47020000</ul>
      <ul>Order: ${po_sbu}</ul>
      `,
    };

    const sendMail = util.promisify((user, callback) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu", // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: "olsonperrensen@zohomail.eu",
          pass: `${process.env.S3_BUCKET}`,
        },
      });

      transporter.sendMail(mailOptions, callback);
    });

    // Send email
    await sendMail(req.body);

    res.send("200");
  } catch (err) {
    res.send("500");
  }
});

app.put("/clients", authenticateToken, async (req, res) => {
  try {
    console.log(
      `New edit came: "${req.body.old_client}" to be replaced with "${req.body.new_client}"`
    );

    const queryText = `UPDATE BIZ SET biz_name = '${req.body.new_client}' WHERE biz_name = '${req.body.old_client}'`;
    await query(queryText);

    console.log(`Record updated: ${req.body.new_client}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT update: ${err}`);
    res.send("500");
  }
});

app.put("/betaald", authenticateToken, async (req, res) => {
  try {
    console.log(
      `New betaald edit came: "${req.body.u_ID}" to be updated with "${req.body.betaald}" as payment status`
    );

    const updateQuery = `UPDATE PO SET betaald = ${req.body.betaald} WHERE id = '${req.body.u_ID}'`;
    await query(updateQuery);

    console.log(`Betaald record updated to: ${req.body.betaald}`);

    const insertDeleteQuery = `
      INSERT INTO apo SELECT * FROM po WHERE id = '${req.body.u_ID}';
      DELETE FROM po USING apo WHERE po.id = '${req.body.u_ID}';
    `;
    await query(insertDeleteQuery);

    console.log(`PO record deleted: ${req.body.u_ID}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`Error occurred: ${err}`);
    res.send("500");
  }
});

app.put("/salesrep", authenticateToken, async (req, res) => {
  try {
    console.log(
      `New SalesRep edit came: "${req.body.old_salesrep}" to be updated with "${req.body.new_salesrep}" as name and all extra info...`
    );

    const updateQuery = `
      UPDATE users 
      SET username = '${req.body.new_email}', 
          password = '${req.body.new_pwd}', 
          naam = '${req.body.new_salesrep}', 
          sbu = '${req.body.new_sbu}', 
          land = '${req.body.new_land}'
      WHERE naam = '${req.body.old_salesrep}'
    `;
    await query(updateQuery);

    console.log(`SalesRep record updated: ${req.body.new_salesrep}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT SalesRep update: ${err}`);
    res.send("500");
  }
});

app.delete("/clients", authenticateToken, async (req, res) => {
  try {
    const RECORD_TO_DELETE = req.body;
    console.log(
      `New delete came: "${RECORD_TO_DELETE}" with content "${RECORD_TO_DELETE.old_client}"`
    );

    const deleteQuery = `
      DELETE FROM BIZ 
      WHERE biz_name = '${req.body.old_client}'
    `;
    await query(deleteQuery);

    console.log(`Record deleted: ${req.body.old_client}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT delete: ${err}`);
    res.send("500");
  }
});

app.delete("/po", authenticateToken, async (req, res) => {
  try {
    const RECORD_TO_DELETE = req.body;
    console.log(`New delete came: `);
    console.log(RECORD_TO_DELETE);
    console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);

    const deleteQuery = `
      INSERT INTO apo SELECT * FROM po WHERE id = '${req.body.u_ID}';
      DELETE FROM po USING apo WHERE po.id = '${req.body.u_ID}';
    `;
    await query(deleteQuery);

    console.log(`PO record deleted ${req.body.u_ID}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT PO delete: ${err}`);
    res.send("500");
  }
});

app.delete("/salesrep", authenticateToken, async (req, res) => {
  try {
    const RECORD_TO_DELETE = req.body;
    console.log(`New delete came for Sales Rep: `);
    console.log(RECORD_TO_DELETE);
    console.log(`with content "${RECORD_TO_DELETE.u_salesrep}"`);

    const deleteQuery = `DELETE FROM users WHERE naam = '${req.body.u_salesrep}';`;
    await query(deleteQuery);

    console.log(`SALES REP record deleted ${req.body.u_salesrep}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT SALES REP delete: ${err}`);
    res.send("500");
  }
});

app.post("/vendor", upload.single("v_file"), authenticateToken, (req, res) => {
  // TODO est_annual spend insertion into DB
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
        '${date.format(new Date(), "YYYY/MM/DD HH:mm:ss")}',
        '${req.body.v_klant}',
        '${req.body.v_adres}',
        '${req.body.v_email}',
        '${req.body.v_gsm}',
        '${req.body.v_vat}',
        '${req.body.v_contact}',
        '${req.body.v_klantnr}',
        '${req.file.originalname}',
        '${"Pending"}')
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
      sales_man = element[0].MANAGER.split(" ");
    }
  });

  sales_per = req.body.v_worker.split(" ");
  subject_klant = req.body.v_klant.split(" ");

  setTimeout(() => {
    const mailOptions = {
      from: "olsonperrensen@zohomail.eu",
      to: [
        `students.benelux@sbdinc.com`,
        `${sales_per[0]}.${sales_per[1]}@sbdinc.com`,
      ],
      cc: `${sales_man[0]}.${sales_man[1]}@sbdinc.com`,
      subject: `Vendor Aanvraag #${db_id} ${subject_klant[0]}`,
      html: `<div style="background-color: #f8f9fa; padding: 20px;">
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <h2 style="color: #007bff;">Request Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 10px;">Requested By:</td>
            <td style="padding: 10px;">${req.body.v_worker}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer:</td>
            <td style="padding: 10px;">${req.body.v_klant}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer Address:</td>
            <td style="padding: 10px;">${req.body.v_adres}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer Email:</td>
            <td style="padding: 10px;">${req.body.v_email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer Phone:</td>
            <td style="padding: 10px;">${req.body.v_gsm}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer VAT No.:</td>
            <td style="padding: 10px;">${req.body.v_vat}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Estimated Annual Spend:</td>
            <td style="padding: 10px;">${req.body.v_estimated_annual_spend}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer Contact:</td>
            <td style="padding: 10px;">${req.body.v_contact}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Customer No.:</td>
            <td style="padding: 10px;">${req.body.v_klantnr}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">PDF File:</td>
            <td style="padding: 10px;">${req.file.originalname}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Reason:</td>
            <td style="padding: 10px;">Level 4 vendor, for customer: ${req.body.v_klant} (${req.body.v_klantnr}), forum contribution</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 10px;">Special Instructions:</td>
            <td style="padding: 10px;">payment terms- payable 30 days after invoice, for customer: ${req.body.v_klant} (${req.body.v_klantnr}) level4 vendor</td>
          </tr>
        </table>
      </div>
    </div>`,
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
        host: "smtp.zoho.eu", // hostname
        port: 465, // port for secure SMTP
        secure: true,
        auth: {
          user: "olsonperrensen@zohomail.eu",
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
        res.send({ error: "Failed to send email" });
      } else {
        console.log("Email has been sent");
        res.send(info);
      }
    });
  }, 1000);
});

app.put("/gr", authenticateToken, async (req, res) => {
  try {
    const RECORD_TO_UPDATE = req.body;
    console.log(`New GR update came: `);
    console.log(RECORD_TO_UPDATE);
    console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);

    const updateQuery = `UPDATE po SET gr = '${req.body.new_gr}' WHERE id = '${req.body.u_ID}';`;
    await query(updateQuery);

    console.log(`GR record updated ${req.body.u_ID}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT PO delete: ${err}`);
    res.send("500");
  }
});

app.delete("/gr", authenticateToken, async (req, res) => {
  try {
    const RECORD_TO_DELETE = req.body;
    console.log(`New GR delete came: `);
    console.log(RECORD_TO_DELETE);
    console.log(`with content "${RECORD_TO_DELETE.u_ID}"`);

    const deleteQuery = `DELETE FROM po WHERE po.id = '${req.body.u_ID}';`;
    await query(deleteQuery);

    console.log(`GR record deleted ${req.body.u_ID}`);

    console.log(`LOG after Promise, now isRecordInDB is ${isRecordInDB}`);
    res.send("200");
  } catch (err) {
    console.log(`CANNOT GR delete: ${err}`);
    res.send("500");
  }
});

// JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format

    // Verify the token
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }

      req.user = user; // Attach the decoded user information to the request object
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
}
