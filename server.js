const PORT = process.env.PORT || 3005;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const NotesDB = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(NotesDB.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function createNote(body, arraynote) {
    const Note = body;
    if (!Array.isArray(arraynote))
    arraynote = [];
    
    if (arraynote.length === 0)
    arraynote.push(0);

    body.id = arraynote[0];
    arraynote[0]++;

    arraynote.push(Note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(arraynote, null, 2)
    );
    return Note;
}

app.post('/api/notes', (req, res) => {
    const CreateNotes = createNote(req.body, NotesDB);
    res.json(CreateNotes);
});

function deletenotes(id, arraynote) {
    for (let i = 0; i < arraynote.length; i++) {
        let note = arraynote[i];

        if (note.id == id) {
            arraynote.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(arraynote, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deletenotes(req.params.id, NotesDB);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
