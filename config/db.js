import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "streaming_app"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

export default db;
