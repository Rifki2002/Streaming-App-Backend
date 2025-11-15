import db from "../config/db.js";

export const getAllMovies = (req, res) => {
  const { genre, search, sortBy, sortDir } = req.query;
  let sql = "SELECT * FROM episodemovie";
  const conditions = [];
  const params = [];

  if (genre) {
    conditions.push("Genre_ID = ?");
    params.push(genre);
  }
  if (search) {
    conditions.push("Title LIKE ?");
    params.push(`%${search}%`);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  const allowedSort = ["Title", "Tahun", "Rating"];
  if (sortBy && allowedSort.includes(sortBy)) {
    const direction = sortDir && sortDir.toLowerCase() === "desc" ? "DESC" : "ASC";
    sql += ` ORDER BY ${sortBy} ${direction}`;
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

export const getMovieById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM episodemovie WHERE ID = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Movie not found" });
    res.json(results[0]);
  });
};

export const addMovie = (req, res) => {
  const {
    Series_ID = null,
    Genre_ID,
    Title,
    Image = null,
    Description = null,
    Durasi = null,
    Rating = null,
    Tahun = null,
    Cast = null,
    Pembuat_Film = null
  } = req.body;

  if (!Title || !Genre_ID) {
    return res.status(400).json({ message: "Title dan Genre_ID wajib diisi" });
  }

  const sql = `
    INSERT INTO episodemovie 
    (Series_ID, Genre_ID, Title, Image, Description, Durasi, Rating, Tahun, Cast, Pembuat_Film)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [Series_ID, Genre_ID, Title, Image, Description, Durasi, Rating, Tahun, Cast, Pembuat_Film],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Movie added", id: result.insertId });
    }
  );
};

export const updateMovie = (req, res) => {
  const { id } = req.params;
  const {
    Series_ID = null,
    Genre_ID,
    Title,
    Image,
    Description,
    Durasi,
    Rating,
    Tahun,
    Cast,
    Pembuat_Film
  } = req.body;

  const sql = `
    UPDATE episodemovie 
    SET Series_ID = ?, Genre_ID = ?, Title = ?, Image = ?, Description = ?, Durasi = ?, 
        Rating = ?, Tahun = ?, Cast = ?, Pembuat_Film = ?
    WHERE ID = ?
  `;

  db.query(
    sql,
    [Series_ID, Genre_ID, Title, Image, Description, Durasi, Rating, Tahun, Cast, Pembuat_Film, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Movie not found" });
      res.json({ message: "Movie updated successfully" });
    }
  );
};

export const deleteMovie = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM episodemovie WHERE ID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  });
};
