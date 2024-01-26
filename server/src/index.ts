import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

// curl http://localhost:5000/api/notes
app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  // res.json({ message: "success!" });
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content fields are required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops, something went wrong on our end!");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("Title and content fields are required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops somethign went wrong on our end");
  }
});

app.listen(5000, () => {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "\n >>>>> Server running on localhost:5000 >>>>> \n"
  );
});
