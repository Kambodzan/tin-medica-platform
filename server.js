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

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

const testConnection = async () => {
  try {
    await db.query('SELECT 1');
    console.log('Connected to MySQL.');
  } catch (err) {
    console.error('Connection error to DB:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(testConnection, 5000);
  }
};

testConnection();

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const query = `
      INSERT INTO Users (id, name, surname, email, password) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [id, firstName, lastName, email, hashedPassword]);

    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.name,
        lastName: user.surname,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Error during login');
  }
});

app.get('/prescriptions/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      p.id AS id,
      DATE_FORMAT(p.date_of_issue, '%d.%m.%Y') AS date,
      CONCAT('dr ', u.name, ' ', u.surname) AS doctor,
      c.name AS clinic,
      IF(p.was_realized, 'Zrealizowana', 'Wystawiona') AS status,
      d.name AS drug_name,
      p.expiration_date,
      p.code
    FROM Prescriptions p
    JOIN Drugs d ON p.Drugs_id = d.id
    JOIN Doctors doc ON p.Doctors_id = doc.id
    JOIN Users u ON doc.Users_id = u.id
    JOIN Clinics c ON doc.Clinics_id = c.id
    WHERE p.Users_id = ?
    ORDER BY p.date_of_issue DESC
  `;

  try {
    const [prescriptions] = await db.query(query, [user_uuid]);
    res.json({ prescriptions });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/tests/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      t.id AS test_id,
      t.test_type,
      t.reason,
      t.result,
      t.test_code,
      t.ordered_at,
      t.result_at,
      CONCAT('dr ', u.name, ' ', u.surname) AS doctor_name
    FROM Tests t
    JOIN Doctors d ON t.Doctors_id = d.id
    JOIN Users u ON d.Users_id = u.id
    WHERE t.Users_id = ?
  `;

  try {
    const [tests] = await db.query(query, [user_uuid]);
    res.json({ tests });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/referrals/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      r.id AS referral_id,
      r.reason,
      r.note,
      CONCAT('dr ', uf.name, ' ', uf.surname) AS referred_by,
      CONCAT('dr ', ut.name, ' ', ut.surname) AS referred_to,
      r.urgent AS is_urgent,
      u.name AS patient_name,
      u.surname AS patient_surname
    FROM Referrals r
    JOIN Doctors df ON r.Doctors_from_id = df.id
    JOIN Users uf ON df.Users_id = uf.id
    JOIN Doctors dt ON r.Doctors_to_id = dt.id
    JOIN Users ut ON dt.Users_id = ut.id
    JOIN Users u ON r.Users_id = u.id
    WHERE r.Users_id = ?
  `;

  try {
    const [referrals] = await db.query(query, [user_uuid]);
    res.json({ referrals });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/medical-history/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      mh.id AS history_id,
      c.date AS consultation_date,
      c.diagnosis AS consultation_diagnosis,
      c.patients_history AS consultation_history,
      c.examination_result AS consultation_result,
      CONCAT('dr ', u_doc.name, ' ', u_doc.surname) AS consultation_doctor,
      d_doc.speciality as specialization,
      r.reason AS referral_reason,
      r.note AS referral_note,
      CONCAT('dr ', u_from.name, ' ', u_from.surname) AS referred_by,
      CONCAT('dr ', u_to.name, ' ', u_to.surname) AS referred_to,
      t.test_type,
      t.reason AS test_reason,
      t.result AS test_result,
      p.date_of_issue AS prescription_date,
      p.expiration_date AS prescription_expiration,
      d.name AS drug_name,
      d.active_ingredient AS drug_active_ingredient,
      d.amount_of_substance AS drug_amount,
      d.unit_of_quantity AS drug_unit
    FROM MedicalHistory mh
    LEFT JOIN Consultations c ON mh.Consultations_id = c.id
    LEFT JOIN Doctors d_doc ON c.Doctors_id = d_doc.id
    LEFT JOIN Users u_doc ON d_doc.Users_id = u_doc.id
    LEFT JOIN Referrals r ON mh.Referrals_id = r.id
    LEFT JOIN Doctors d_from ON r.Doctors_from_id = d_from.id
    LEFT JOIN Users u_from ON d_from.Users_id = u_from.id
    LEFT JOIN Doctors d_to ON r.Doctors_to_id = d_to.id
    LEFT JOIN Users u_to ON d_to.Users_id = u_to.id
    LEFT JOIN Tests t ON mh.Tests_id = t.id
    LEFT JOIN Prescriptions p ON mh.Prescriptions_id = p.id
    LEFT JOIN Drugs d ON p.Drugs_id = d.id
    WHERE mh.Users_id = ?
  `;

  try {
    const [medicalHistory] = await db.query(query, [user_uuid]);
    res.json({ medicalHistory });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/visit-dates/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      vd.id AS visit_id,
      vd.consultation_type,
      DATE_FORMAT(vd.date, '%Y-%m-%d %H:%i:%s') AS visit_date,
      CONCAT('dr ', u_doc.name, ' ', u_doc.surname) AS doctor_name,
      d.speciality AS doctor_speciality,
      c.name AS clinic_name,
      c.address AS clinic_address
    FROM VisitDates vd
    JOIN Doctors d ON vd.Doctors_id = d.id
    JOIN Users u_doc ON d.Users_id = u_doc.id
    JOIN Clinics c ON vd.Clinics_id = c.id
    WHERE vd.Users_id = ?
    ORDER BY vd.date DESC
  `;

  try {
    const [visits] = await db.query(query, [user_uuid]);
    res.json({ visits });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/visit-dates-dates/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      DATE_FORMAT(vd.date, '%Y-%m-%d') AS visit_date
    FROM VisitDates vd
    WHERE vd.Users_id = ?
  `;

  try {
    const [results] = await db.query(query, [user_uuid]);
    const visitDates = results.map((row) => row.visit_date);
    res.json({ visitDates });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/dashboard/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;

  try {
    // Zapytanie o wizyty na najbliższy tydzień
    const visitDatesQuery = `
      SELECT 
        vd.date AS visit_date,
        vd.consultation_type,
        CONCAT('dr ', u.name, ' ', u.surname) AS doctor_name,
        c.name AS clinic_name
      FROM VisitDates vd
      JOIN Doctors d ON vd.Doctors_id = d.id
      JOIN Users u ON d.Users_id = u.id
      JOIN Clinics c ON vd.Clinics_id = c.id
      WHERE vd.Users_id = ?
      AND vd.date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
      ORDER BY vd.date ASC
    `;

    const [visitDates] = await db.query(visitDatesQuery, [user_uuid]);

    // Zapytanie o 3 ostatnie wizyty
    const lastVisitsQuery = `
      SELECT 
        mh.id AS history_id,
        c.date AS consultation_date,
        c.diagnosis AS consultation_diagnosis,
        CONCAT('dr ', u.name, ' ', u.surname) AS doctor_name,
        d.speciality,
        cl.name AS clinic_name,
        cl.address AS clinic_address
      FROM MedicalHistory mh
      JOIN Consultations c ON mh.Consultations_id = c.id
      JOIN Doctors d ON c.Doctors_id = d.id
      JOIN Users u ON d.Users_id = u.id
      JOIN Clinics cl ON d.Clinics_id = cl.id
      WHERE mh.Users_id = ?
      ORDER BY c.date DESC
      LIMIT 3
    `;

    const [lastVisits] = await db.query(lastVisitsQuery, [user_uuid]);

    // Zapytanie o wszystkie testy
    const testsQuery = `
      SELECT 
        t.id AS test_id,
        t.test_code AS test_code,
        t.test_type,
        t.reason,
        t.result,
        t.ordered_at,
        t.result_at,
        CONCAT('dr ', u.name, ' ', u.surname) AS doctor_name
      FROM Tests t
      JOIN Doctors d ON t.Doctors_id = d.id
      JOIN Users u ON d.Users_id = u.id
      WHERE t.Users_id = ?
    `;

    const [tests] = await db.query(testsQuery, [user_uuid]);

    // Zapytanie o wszystkie recepty
    const prescriptionsQuery = `
      SELECT 
        p.id AS prescription_id,
        p.date_of_issue,
        p.expiration_date,
        p.was_realized,
        d.name AS drug_name,
        d.active_ingredient AS active_ingredient,
        CONCAT('dr ', u.name, ' ', u.surname) AS doctor_name
      FROM Prescriptions p
      JOIN Drugs d ON p.Drugs_id = d.id
      JOIN Doctors doc ON p.Doctors_id = doc.id
      JOIN Users u ON doc.Users_id = u.id
      WHERE p.Users_id = ?
    `;

    const [prescriptions] = await db.query(prescriptionsQuery, [user_uuid]);

    // Zapytanie o 4 skierowania
    const referralsQuery = `
      SELECT 
        r.id AS referral_id,
        r.reason,
        r.note,
        r.urgent,
        CONCAT('dr ', uf.name, ' ', uf.surname) AS referred_by,
        CONCAT('dr ', ut.name, ' ', ut.surname) AS referred_to,
        r.Users_id
      FROM Referrals r
      JOIN Doctors df ON r.Doctors_from_id = df.id
      JOIN Users uf ON df.Users_id = uf.id
      JOIN Doctors dt ON r.Doctors_to_id = dt.id
      JOIN Users ut ON dt.Users_id = ut.id
      WHERE r.Users_id = ?
      ORDER BY r.id DESC
      LIMIT 4
    `;

    const [referrals] = await db.query(referralsQuery, [user_uuid]);

    // Zwrot danych do klienta
    res.json({
      visitDates,
      lastVisits,
      tests,
      prescriptions,
      referrals,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /profile/:user_uuid – odczyt danych użytkownika
app.get('/profile/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;

  const query = `
    SELECT 
      id, 
      name, 
      surname, 
      email, 
      PESEL, 
      phone_number
    FROM Users
    WHERE id = ?
  `;

  try {
    const [rows] = await db.query(query, [user_uuid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = rows[0];
    return res.json({ user });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /profile/:user_uuid – zapis danych użytkownika (bez email i password)
app.post('/profile/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const {
    name,
    surname,
    PESEL,
    phone_number
  } = req.body;

  // Aktualizujemy tylko name, surname, PESEL, phone_number
  const query = `
    UPDATE Users
    SET
      name = ?,
      surname = ?,
      PESEL = ?,
      phone_number = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(query, [
      name,
      surname,
      PESEL,
      phone_number,
      user_uuid
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/users/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const query = `
    SELECT 
      id, 
      name, 
      surname, 
      email, 
      PESEL, 
      phone_number 
    FROM Users 
    WHERE id = ?`;

  try {
    const [user] = await db.query(query, [user_uuid]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/users/:user_uuid', async (req, res) => {
  const { user_uuid } = req.params;
  const { name, surname, PESEL, phone_number } = req.body;


  if (!name || !surname) {
    return res.status(400).json({ message: 'Name and surname are required' });
  }

  const query = `
    UPDATE Users 
    SET 
      name = ?,
      surname = ?,
      PESEL = ?,
      phone_number = ?
    WHERE id = ?`;

  try {
    const [result] = await db.query(query, [
      name,
      surname,
      PESEL || null,
      phone_number || null,
      user_uuid
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/specialities', async (req, res) => {
  const query = `SELECT DISTINCT speciality FROM Doctors;`;
  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/doctors/:speciality', async (req, res) => {
  const { speciality } = req.params;
  const query = `
    SELECT Doctors.id, CONCAT(Users.name, ' ', Users.surname) AS full_name
    FROM Doctors
    JOIN Users ON Doctors.Users_id = Users.id
    WHERE Doctors.speciality = $1;
  `;
  try {
    const { rows } = await pool.query(query, [speciality]);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/clinics/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  const query = `
    SELECT Clinics.id, Clinics.name, Clinics.address
    FROM Clinics
    JOIN Doctors ON Clinics.id = Doctors.Clinics_id
    WHERE Doctors.id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [doctorId]);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/available-times/:clinicId', async (req, res) => {
  const { clinicId } = req.params;
  const query = `
    SELECT id, consultation_type, date
    FROM VisitDates
    WHERE Clinics_id = $1 AND Users_id IS NULL;
  `;
  try {
    const { rows } = await pool.query(query, [clinicId]);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/available-times/:clinicId/:doctorId', async (req, res) => {
  const { clinicId, doctorId } = req.params;
  const query = `
    SELECT id, consultation_type, date
    FROM VisitDates
    WHERE Clinics_id = $1 AND Doctors_id = $2 AND Users_id IS NULL;
  `;
  try {
    const { rows } = await pool.query(query, [clinicId, doctorId]);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/", (req, res) => {
  res.send("Witam");
});

// Start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
