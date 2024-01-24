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

// curl http://localhost:5000/api/notes

app.listen(5000, () => {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "\n >>>>> Server running on localhost:5000 >>>>> \n"
  );
});
