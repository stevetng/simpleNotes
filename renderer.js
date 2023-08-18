const { ipcRenderer } = require('electron');

let notes = [];

function createNote() {
  const note = {
    id: Date.now(),
    content: '',
    timestamp: new Date().toISOString()
  };

  notes.push(note);
  ipcRenderer.send('save-note', note);
  renderNotes();
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  ipcRenderer.send('delete-note', id);
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById('notes');
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => deleteNote(note.id));

    const noteContent = document.createElement('textarea');
    noteContent.value = note.content;
    noteContent.addEventListener('change', (event) => {
      note.content = event.target.value;
      ipcRenderer.send('save-note', note);
    });

    noteElement.appendChild(deleteButton);
    noteElement.appendChild(noteContent);
    notesContainer.appendChild(noteElement);
  });
}

document.getElementById('new-note').addEventListener('click', createNote);

ipcRenderer.on('get-notes-response', (event, data) => {
  notes = data;
  renderNotes();
});

ipcRenderer.send('get-notes');
