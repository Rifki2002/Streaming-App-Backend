import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);        
app.use("/api/movies", verifyToken, movieRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api", verifyRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🎬 Movie Streaming API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
