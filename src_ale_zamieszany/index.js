const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(cors({origin: 'http://localhost:4200', credentials: true}));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // or whatever your phpMyAdmin username is
    password: '',       // default is blank if using XAMPP
    database: 'zadania' // your actual database name in phpMyAdmin
  });

db.connect(err => {
    if (err) {
      console.error('❌ DB connection failed:', err);
    } else {
      console.log('✅ Connected to MySQL');
    }
  });
//registering moze zamiast /register uzyc users? nah dziala
app.post('/register', (req, res) => {
  const { login, password } = req.body;
  const query = `INSERT INTO users (login, password) VALUES (?, ?)`;
  db.query(query, [login, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error registering user', error: err });
    const userId = result.insertId;
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  });
});

//logging
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  const query = `SELECT * FROM users WHERE login = ? AND password = ?`;
  db.query(query, [login, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get('/users', (req, res) => {
  const login = req.query.login;
  if (!login) return res.status(400).send('Login query is required.');
  const query = 'SELECT * FROM users WHERE login = ?';
  db.query('SELECT * FROM users WHERE login = ?', [login], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('User not found');
    res.send(results[0]);
  });
});

// Update user
app.put('/users/:id', (req, res) => {
const { id } = req.params;
const { login, password } = req.body;

const fields = [];
const values = [];

if (login) {
  fields.push('login = ?');
  values.push(login);
}
if (password) {
  fields.push('password = ?');
  values.push(password);
}

if (fields.length === 0) return res.sendStatus(400); // Nothing to update

const sql = `UPDATE users SET ${fields.join(', ')} WHERE Uid = ?`;
values.push(id);

db.query(sql, values, (err, result) => {
  if (err) return res.status(500).send(err);
  res.send({ message: 'User updated successfully' });
});
});
// Delete user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE Uid = ?';
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('User not found');
    
    res.send({ message: 'User deleted successfully' });
  });
});

// Add task
app.post('/tasks', (req, res) => {
    const { task_name, deadline, task_status, userId } = req.body;
  
    const query = `INSERT INTO tasks (task_name, deadline, task_status, userId)
                   VALUES (?, ?, ?, ?)`;
  
    db.query(query, [task_name, deadline, task_status, userId], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId, ...req.body });
    });
  });
  // Get all tasks
  app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` 🚀Server running on http://localhost:${PORT}`);
});
