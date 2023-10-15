const express = require('express');
// const maxId = require('./utils/maxId');
const cors = require('cors');
const morgan = require('morgan');

const maxId = (items) => {
    const Max = (items.length > 0) ? Math.max(...items.map(item=>item.id)) : 0
    return Max + 1
}

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('post-data', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '-';
  });


app.use(morgan(function (tokens, req, res) {
    return [
      'Método:', tokens.method(req, res),
      'URL:', tokens.url(req, res),
      'Código de estado:', tokens.status(req, res),
      'Tiempo de respuesta:', tokens['response-time'](req, res), 'ms',
      'Datos POST:', tokens['post-data'](req, res), 
    ].join(' ');
  }));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

//obtener todas las personas
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/info', (request, response) => {
    const h1 = `<h1>Phonebook has info for ${persons.length} people</h1>`;
    const p = `<p>${new Date()}</p>`;
    response.send(h1 + p);
})

//get single person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    console.log("🚀 ~ file: index.js:54 ~ app.delete ~ id:", id)
    persons = persons.filter(person=> person.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
    const body = request.body;
    // console.log("🚀 ~ file: index.js:61 ~ app.post ~ body:", body)

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const existingPerson = persons.find(person=> person.name === body.name);

    if(existingPerson){
        return response.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
        id: maxId(persons),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.status(201).json({...newPerson, message:"Persona agregada correctamente"})
})

//crear el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});