import { useEffect, useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

const BASE_URL = "http://localhost:5000/api/notes";

const App = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(BASE_URL);
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      notify(`${newNote.title} added`);
      resetFormFields();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );
      setNotes(updatedNotesList);
      resetFormFields();
      notify(`${updatedNote.title} updated`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (
    e: React.MouseEvent,
    noteId: number,
    title: string
  ) => {
    e.stopPropagation();

    try {
      await fetch(`${BASE_URL}/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      resetFormFields();
      notify(`${title} deleted`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancel = () => {
    resetFormFields();
  };

  const resetFormFields = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const notify = (message: string) => toast(message);

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={!selectedNote ? handleAddNote : handleUpdateNote}
      >
        <input
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <textarea
          placeholder="Content"
          rows={10}
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        {!selectedNote ? (
          <>
            <button type="submit">
              <span>Add Note</span>
            </button>
          </>
        ) : (
          <div className="edit-buttons">
            <button type="submit">Update</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={(e) => deleteNote(e, note.id, note.title)}>
                x
              </button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
      <ToastContainer limit={3} autoClose={4000} />
    </div>
  );
};

export default App;
