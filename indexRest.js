`use strict`;
const cors = require(`cors`);
const express = require(`express`);
const app = express();
const { port, host } = require(`./config.json`);
const Tietovarasto = require(`./sqlvarasto/tietovarastokerros`);
const varasto = new Tietovarasto();

app.use(cors());
app.use(express.json());

app.get(`/api/kissat`, (req, res) =>
    varasto.haeKaikki()
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe))
);

app.get(`/api/kissat/:tunniste`, (req, res) =>
    varasto.hae(req.params.tunniste)
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json(virhe))
);

app.post(`/api/kissat`, (req, res) => {
    const tietokone = req.body;
    varasto.lisaa(tietokone)
        .then(status => res.json(status))
        .catch(virhe => res.json(virhe))
});

app.delete(`/api/kissat/:tunniste`, (req, res) => {
    const tunniste = req.params.tunniste;
    varasto.poista(tunniste)
        .then(status => res.json(status))
        .catch(virhe => res.json(virhe))
});

app.put(`/api/kissat/:tunniste`, (req, res) => {
    const tietokone = req.body;
    const tunniste = req.params.tunniste;
    varasto.paivita(tunniste, tietokone)
        .then(status => res.json(status))
        .catch(virhe => res.json(virhe))
});


app.all(`*`, (req, res) => res.json({ viesti: `resurssia ei tuettu`, tyyppi: `virhe` }));
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee`));