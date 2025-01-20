const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const connectWithRetry = () => {
  db.connect((err) => {
    if (err) {
      console.error("Connection error to DB:", err.message);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("Connected to MySQL.");
    }
  });
};
connectWithRetry();

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const id = uuidv4();

  db.query('INSERT INTO Users (id, name, surname, email, password) VALUES (?, ?, ?, ?, ?)', [id, firstName, lastName, email, hashedPassword], (err) => {
      if (err) {
        console.log(err); 
        return res.status(500).send('Error registering user');
      }
      res.status(201).send('User registered');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send('Invalid credentials');

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.name,
        lastName: user.surname,
        profilePicture: user.profilePicture,
      },
    });
  });
});

app.get("/get-example", (req, res) => {
  const query = "SELECT * FROM example;";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error while fetching data:", err.message);
      res.status(500).send("Internal server error");
      return;
    }
    res.json(results);
  });
});

app.get("/", (req, res) => {
  res.send("Masz malego siura");
});

// Start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
