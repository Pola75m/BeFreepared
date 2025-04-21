const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(cors());
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
/* Task model
const Task = mongoose.model('Task', {
  idZad: Integer,
  task_name: String,
  userId: Integer,
  task_status: String,
  deadline: String,
});

// Routes
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});*/
