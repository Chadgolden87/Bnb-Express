import cors from "cors"
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const {Pool} = pg;
let app = express();

const pool = new Pool({
  user: "neondb_owner",
  host: "postgresql://neondb_owner:7Mn9buGzOWXv@ep-wispy-moon-a5sw4qo7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  database: "neondb",
  password: "password",
  port: 5432,
});

const cors = require('cors')
const corsOptions = {
  origin: "https://bnbvue.vercel.app/",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/");

app.get("/upcoming", function (req, res) {
  pool.query(
    "SELECT * FROM eventstable ORDER BY event_date ASC",
    function (error, results) {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

app.get("/library/:id", function (req, res) {
    let id = req.params.id;
  
    pool.query("SELECT * FROM library WHERE id = $1", [id], function (error, results) {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  });

app.get("/library", function (req, res) {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.type('application/json');
  pool.query("SELECT * FROM library", function (error, results) {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});





app.get("/volunteer", function (req, res) {
  pool.query("SELECT * FROM volunteers", function (error, results) {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.post("/volunteer", function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let availability = req.body.availability;
  let event = req.body.event;

  pool.query(
    "INSERT INTO volunteers (name, email, phone, availability, event) VALUES ($1, $2, $3, $4, $5)",
    [name, email, phone, availability, event],
    function (error, results) {
      if (error) {
        console.log(error);
        throw error;
      }
      res.send(req.body);
    }
  );
});

app.get("/donations", function (req, res) {
  pool.query("SELECT * FROM donations", function (error, results) {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.listen(3000);
export default app