const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const { PORT = 3001 } = process.env

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const rootListener = (req, res) => {
  res.send('<h1>Hello World</h1>')
}

const notesListener = (req, res) => {
  res.json(notes)
}

const singleNoteListener = (req, res) => {
  const noteId = Number(req.params.id)
  const predicate = ({ id }) => id === noteId
  const note = notes.find(predicate)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
}

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0

  return maxId + 1
}

const postListener = (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  res.json(note)
}

const deleteNoteListener = (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
}

const portListener = () => {
  console.log(`Server running on port ${PORT}`)
}

const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', rootListener)
app.get('/api/notes', notesListener)
app.get('/api/notes/:id', singleNoteListener)
app.post('/api/notes', postListener)
app.delete('/api/notes/:id', deleteNoteListener)

const notFound = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint '})
}

app.use(notFound)

app.listen(PORT, portListener)
