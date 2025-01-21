const express = require('express');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();  // Import sqlite3
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Could not connect to the database:", err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Ensure that the 'users' table is created if it doesn't already exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  );
`, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  }
  else {
    console.log("Table 'users' is ready.");
  }
});

// Example: Insert data into the table
db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, ['John Doe', 'john@example.com'], function(err) {
  if (err) {
    return console.log(err.message);
  }
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

// Example: Query all users
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Example: Insert new user through API (POST request)
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run(name, email, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
  stmt.finalize();
});

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});