import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("🎬 Movie Streaming API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
