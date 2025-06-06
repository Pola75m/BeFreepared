const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const { DateTime } = require('luxon');

//ustawienie cors i konretnego portu localhosta dla Angulara
app.use(cors({origin: 'http://localhost:4200', credentials: true}));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // root jest tymczasowy
    password: '',       
    database: 'zadania' 
  });

//łączenie się z bazą danych 
db.connect(err => {
    if (err) {
      console.error('Nie udało się połączyć z bazą danych: ', err);
    } else {
      console.log('Mamy połączenie!');
    }
  });

//logika backendowa rejestracji
app.post('/register', (req, res) => {
  const { login, password } = req.body;
  const query = `INSERT INTO users (login, password) VALUES (?, ?)`;
  db.query(query, [login, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Błąd rejestracji: ', error: err });
    const userId = result.insertId;
    res.status(201).json({ message: 'Zarejestrowany user:', userId: result.insertId });
  });
});

//logika backendowa logowania
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  const query = `SELECT * FROM users WHERE login = ? AND password = ?`;
  db.query(query, [login, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Błąd bazy danych: ', error: err });
    if (results.length > 0) {
      res.status(200).json({ message: 'Logowanie powiodło się!', user: results[0] });
    } else {
      res.status(401).json({ message: 'Coś poszło nie tak, spróbuj jeszcze raz' });
    }
  });
});

//logika zbierania userów
app.get('/users', (req, res) => {
  const login = req.query.login;
  if (!login) return res.status(400).send('Login query is required.');
  const query = 'SELECT * FROM users WHERE login = ?';
  db.query('SELECT * FROM users WHERE login = ?', [login], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Nie znaleziono usera');
    res.send(results[0]);
  });
});

// logika za zmianami userów
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

if (fields.length === 0) return res.sendStatus(400);

const sql = `UPDATE users SET ${fields.join(', ')} WHERE Uid = ?`;
values.push(id);

db.query(sql, values, (err, result) => {
  if (err) return res.status(500).send(err);
  res.send({ message: 'Edycja powiodła się. Zapisano zmiany.' });
});
});

// Usuwanie user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE Uid = ?';
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Nie znaleziono usera');
    
    res.send({ message: 'Usunięcie usera powiodło się' });
  });
});

// Dodawanie zadań
app.post('/tasks', (req, res) => {
    let { task_name, deadline, task_status, userId } = req.body;

    if (!task_status || task_status.trim() === '') {
      task_status = null;
    }

    if (!deadline || deadline === '-') {
      deadline = null;
    }else {
      deadline = DateTime.fromISO(deadline, { zone: 'utc' }).startOf('day').toISODate();;

    }
    const query = `INSERT INTO tasks (task_name, deadline, task_status, userId)
                   VALUES (?, ?, ?, ?)`;
  
    db.query(query, [task_name, deadline, task_status, userId], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId, task_name, deadline: deadline ?? '-', task_status, userId });
    });
  });

  //edycja zadan
  app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task_name, task_status, deadline } = req.body;

    const parsedDeadline = deadline 
      ? DateTime.fromISO(deadline, { zone: 'utc' }).startOf('day').toJSDate()
      : null;

    const query = 'UPDATE tasks SET task_name = ?, task_status = ?, deadline = ? WHERE id = ?';
    db.query(query, [task_name, task_status || null, parsedDeadline, id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ 
        message: 'Zadanie zaktualizowane pomyślnie',
        id,
        task_name,
        task_status,
        deadline
      });
    });
  });

  //usuwanie zadan
  app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM tasks WHERE id = ?';
  
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Nie znaleziono zadania do usunięcia' });
      }
      res.send({ message: 'Zadanie usunięte pomyślnie' });
    });
  });
  
  // Zbieranie wszystkich zadań w zależności od usera
  app.get('/tasks', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send('Id usera jest potrzebne...');

    const query = 'SELECT * FROM tasks WHERE userId = ?';

    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).send(err);
      const formattedResults = results.map(task => {
        const date = DateTime.fromJSDate(task.deadline, { zone: 'utc' });
        return {
          ...task,
          deadline: date.toISODate(),
    };
    });
      
      res.send(formattedResults);
    });
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer running on http://localhost:${PORT}`);
});
