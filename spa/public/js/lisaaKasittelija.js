'use strict';

(function(){
    let numeroKentta;
    let nimiKentta;
    let pituusKentta;
    let painoKgKentta;
    let rotuKentta;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        numeroKentta=document.getElementById('numero');
        nimiKentta=document.getElementById('nimi');
        pituusKentta=document.getElementById('pituus');
        painoKgKentta=document.getElementById('painoKg');
        rotuKentta=document.getElementById('rotu');

        document.getElementById('laheta')
            .addEventListener('click',laheta);

        numeroKentta.addEventListener('focus', tyhjenna);
    }

    function tyhjenna(){
        numeroKentta.value='';
        nimiKentta.value='';
        pituusKentta.value = '';
        painoKgKentta.value = '';
        rotuKentta.value = '';
        tulosalue.textContent='';
        tulosalue.removeAttribute('class');
    }

    async function laheta(){
        const henkilo={
            numero: +numeroKentta.value,
            nimi: nimiKentta.value,
            pituus: +pituusKentta.value,
            painoKg: +painoKgKentta.value,
            rotu: rotuKentta.value
        };

        try{
            const optiot={
                method:'POST',
                body:JSON.stringify(henkilo),
                headers:{
                    'Content-Type':'application/json'
                }
            };
            const data=await fetch('/lisaa',optiot);
            const tulos=await data.json();

            paivitaStatus(tulos);
        }
        catch(virhe){
            paivitaStatus({ viesti: virhe.message, tyyppi: 'virhe' });
        }
    }//laheta loppu

    function paivitaStatus(status) {
        tulosalue.textContent = status.viesti;
        tulosalue.setAttribute('class', status.tyyppi);
    } //paivitaStatus loppu
})();