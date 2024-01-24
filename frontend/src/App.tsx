import { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Test note",
      content: "Test content",
    },
    {
      id: 2,
      title: "Test note 2",
      content: "Test content 2",
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };
    setNotes([...notes, newNote]);
    resetFormFields();
    notify(`${newNote.title} added`);
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;
    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };
    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );
    setNotes(updatedNotesList);
    resetFormFields();
    notify(`${updatedNote.title} updated`);
  };

  const deleteNote = (e: React.MouseEvent, noteId: number, title: string) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    resetFormFields();
    notify(`${title} deleted`);
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
