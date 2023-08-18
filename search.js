const { ipcRenderer } = require('electron');

let searchInput = document.getElementById('search-input');

searchInput.addEventListener('keyup', function(event) {
  let value = event.target.value;
  ipcRenderer.send('search-notes', value);
});

ipcRenderer.on('search-notes-response', (event, data) => {
  renderSearchResults(data);
});

function renderSearchResults(notes) {
  const searchResultsContainer = document.getElementById('search-results');
  searchResultsContainer.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';

    const noteContent = document.createElement('p');
    noteContent.innerText = note.content;

    noteElement.appendChild(noteContent);
    searchResultsContainer.appendChild(noteElement);
  });
}
