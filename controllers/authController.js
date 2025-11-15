import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import crypto from "node:crypto";

export const register = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const sql = `
      INSERT INTO user (fullname, username, email, password, verification_token)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [fullname, username, email, hashedPassword, token], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      console.log("TOKEN VERIFIKASI:", token);
      const verifyUrl = `http://localhost:3000/api/verify-email?token=${token}`;
      res.status(201).json({
        message: "Registrasi berhasil! Gunakan link ini untuk verifikasi email.",
        verifyUrl
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT 
      id, fullname, Username AS username, email, Password AS password
    FROM user 
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: "Email atau password salah" });
    }
    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    });
  });
};

export const verifyEmail = (req, res) => {
  const { token } = req.query;

  const sql = "SELECT * FROM user WHERE verification_token = ?";

  db.query(sql, [token], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const userId = results[0].id;

    const updateSql = `
      UPDATE user 
      SET verification_token = NULL
      WHERE id = ?
    `;

    db.query(updateSql, [userId], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });

      res.json({ message: "Email Verified Successfully!" });
    });
  });
};
