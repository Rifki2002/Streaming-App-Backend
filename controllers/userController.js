import db from "../config/db.js";

export const getAllUsers = (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};

export const createUser = (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO user (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User created successfully", id: result.insertId });
  });
};  

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const sql = "UPDATE user SET username = ?, password = ? WHERE id = ?";
  db.query(sql, [username, password, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM user WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  });
};
