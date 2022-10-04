'use strict';

(function () { document.addEventListener('DOMContentLoaded', alusta);

    async function alusta() {
        try {
            const data = await fetch('/haeKaikki');
            const kissat = await data.json();
            const tulosjoukko = document.getElementById('tulosjoukko');
            for (let kissa of kissat) {
                const tr = document.createElement('tr');
                tr.appendChild(teeSolu(kissa.numero));
                tr.appendChild(teeSolu(kissa.nimi));
                tr.appendChild(teeSolu(kissa.pituus));
                tr.appendChild(teeSolu(kissa.painoKg));
                tr.appendChild(teeSolu(kissa.rotu));
                tulosjoukko.appendChild(tr);
            }
        } catch (virhe) {
            const viestialue = document.getElementById('viestialue');
            viestialue.textContent = `Virhe: ${virhe.message}`;
            viestialue.setAttribute('class', 'virhe');
        }
    }
    function teeSolu(tieto) {
        const td = document.createElement('td');
        td.textContent = tieto;
        return td;
    }
})();