const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const DB_NAME = 'restCountries.db';


const db = new sqlite3.Database(DB_NAME);

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email, and password are required." });

  const passwordHash = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";
  
  db.run(sql, [name, email, passwordHash], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed"))
        return res.status(400).json({ error: "Email already exists." });
      return res.status(500).json({ error: "Database error." });
    }
    res.status(201).json({ message: "User registered successfully." });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const sql = "SELECT id, password_hash, role FROM users WHERE email = ?";
  db.get(sql, [email], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!row) return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = bcrypt.compareSync(password, row.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    req.session.user_id = row.id;
    req.session.role = row.role;
    res.json({ message: "Login successful." });
  });
};

