`use strict`;
const insertParametrit = kissa => [
    +kissa.numero, kissa.nimi, +kissa.pituus, +kissa.painoKg, kissa.rotu
];

const updateParametrit = kissa => [
    kissa.nimi, +kissa.pituus, +kissa.painoKg, kissa.rotu, +kissa.numero
]

module.exports = { insertParametrit, updateParametrit }