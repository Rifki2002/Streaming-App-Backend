import db from "../config/db.js";

export const getAllUsers = (req, res) => {
  const sql = "SELECT id, fullname, username, email FROM users";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id, fullname, username, email FROM users WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};

export const createUser = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [fullname, username, email, hashed], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res
        .status(201)
        .json({ message: "User created successfully", id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql =
      "UPDATE users SET fullname = ?, username = ?, email = ?, password = ? WHERE id = ?";

    db.query(sql, [fullname, username, email, hashed, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  });
};
