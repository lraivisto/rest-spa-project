'use strict';

(function(){
    let numeroKentta;
    let nimiKentta;
    let pituusKentta;
    let painoKgKentta;
    let rotuKentta;
    let tulosalue;

    let hakutila=true;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        numeroKentta=document.getElementById('numero');
        nimiKentta=document.getElementById('nimi');
        pituusKentta=document.getElementById('pituus');
        painoKgKentta=document.getElementById('painoKg');
        rotuKentta=document.getElementById('rotu');

        tulosalue=document.getElementById('tulosalue');

        hakutila = true;
        paivitaKenttaAttribuutit();

        document.getElementById('laheta')
            .addEventListener('click', laheta);

        numeroKentta.addEventListener('focus',tyhjenna);
    }

    function tyhjenna(){
        //koodi tähän
        if(hakutila) {
            paivitaKenttienTiedot(); //tyhjentää kentät
        }
        tulosalue.textContent = '';
        tulosalue.removeAttribute('class');
    }

    function paivitaKenttaAttribuutit(){
        if(hakutila){
            numeroKentta.removeAttribute('readonly');
            nimiKentta.setAttribute('readonly', true);
            pituusKentta.setAttribute('readonly', true);
            painoKgKentta.setAttribute('readonly', true);
            rotuKentta.setAttribute('readonly', true);
        }
        else{
            numeroKentta.setAttribute('readonly', true);
            nimiKentta.removeAttribute('readonly');
            pituusKentta.removeAttribute('readonly');
            painoKgKentta.removeAttribute('readonly');
            rotuKentta.removeAttribute('readonly');
        }
    } //paivitaKenttaAttribuutit loppu

    function paivitaKenttienTiedot(kissa){
        if(kissa){
            numeroKentta.value=kissa.numero;
            nimiKentta.value=kissa.nimi;
            pituusKentta.value=kissa.pituus;
            painoKgKentta.value=kissa.painoKg;
            rotuKentta.value=kissa.rotu;
            hakutila=false;
        }
        else{
            numeroKentta.value = '';
            nimiKentta.value = '';
            pituusKentta.value = '';
            painoKgKentta.value = '';
            rotuKentta.value = '';
            hakutila=true;
        }
        paivitaKenttaAttribuutit();
    }

    function paivitaStatus(status) {
        tulosalue.textContent = status.viesti;
        tulosalue.setAttribute('class', status.tyyppi);
    } 

    async function laheta(){
        try{
            if(hakutila){
                const numero=+numeroKentta.value;
                const optiot = {
                    method:'POST',
                    body:JSON.stringify({numero}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                };
                if(numero>0){
                    const data = await fetch(`/haeYksi`, optiot);
                    const tulos = await data.json();
                    if (tulos.viesti) {
                        paivitaStatus(tulos);
                    }
                    else {
                        paivitaKenttienTiedot(tulos);
                    }
                }
                else{
                    paivitaStatus({ viesti: 'tyhjä numero', tyyppi: 'virhe' });
                }
            }
            else{
                const kissa={
                    numero:+numeroKentta.value,
                    nimi:nimiKentta.value,
                    pituus:+pituusKentta.value,
                    painoKg:+painoKgKentta.value,
                    rotu:rotuKentta.value
                };

                const optiot={
                    method:'POST',
                    body:JSON.stringify(kissa),
                    headers:{
                        'Content-Type':'application/json'
                    }
                };

                const data = await fetch(`/muuta`, optiot);
                const tulosJson=await data.json();
                if(tulosJson.viesti){
                    paivitaStatus(tulosJson);
                }
                hakutila=true;
                paivitaKenttaAttribuutit();
            }

        }
        catch(virhe){
            paivitaStatus({ viesti: virhe.message, tyyppi: 'virhe' });
        }

    }


})();