'use strict';

const path = require('path');
const express = require('express');
const app = express();
const fetch = require('./fetchlib');
const { port, host } = require('./config.json');
const valikkopolku = path.join(__dirname, 'valikko.html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.get('/', (req, res) => res.sendFile(valikkopolku));
app.get('/haeKaikki', (req, res) => {
    fetch('http://localhost:4000/api/kissat', { mode: 'cors' })
        .then(data => data.json())
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe));
});

app.post('/haeYksi', (req, res) => {
    const numero = req.body.numero;
    fetch(`http://localhost:4000/api/kissat/${numero}`, { mode: 'cors' })
        .then(data => data.json())
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe));
});

app.post('/poista', (req, res) => {
    const numero = req.body.numero;
    fetch(`http://localhost:4000/api/kissat/${numero}`,
        { method: 'DELETE', mode: 'cors' })
        .then(data => data.json())
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe));
});

app.post('/lisaa', (req, res) => {
    const henkilo = req.body;
    const optiot = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(henkilo),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(`http://localhost:4000/api/kissat`, optiot)
        .then(data => data.json())
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe));
});

app.post('/muuta', (req, res) => {
    const henkilo = req.body;
    const optiot = {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(henkilo),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(`http://localhost:4000/api/kissat/${henkilo.numero}`, optiot)
        .then(data => data.json())
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe));
});

app.listen(port, host,
    () => console.log(`${host}:${port} kuuntelee`));