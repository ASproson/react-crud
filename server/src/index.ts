import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  // res.json({ message: "success!" });
  res.json(notes);
});

// http://localhost:5000/api/notes
// or paste in terminal: curl http://localhost:5000/api/notes

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch {
    res.status(500).send("Oops, something went wrong with the DB");
  }
});

app.listen(5000, () => {
  console.log("\n\x1b[31m%s\x1b[0m", "Server running on port 5000 \n");
});
