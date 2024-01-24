import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
  res.json({ message: "success!" });
});

app.listen(5000, () => {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "\n >>>>> Server running on localhost:5000 >>>>> \n"
  );
});
