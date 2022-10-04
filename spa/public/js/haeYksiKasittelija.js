'use strict';

(function (){
    let tulosalue;
    let syote;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        tulosalue=document.getElementById('tulosalue');
        syote = document.getElementById('kissaNumero');
        document.getElementById('hae')
            .addEventListener('click', ()=>laheta(true));
        document.getElementById('poista')
            .addEventListener('click', ()=>laheta(false));
        syote.addEventListener('focus', tyhjenna);
    }

    function tyhjenna(){
        syote.value='';
        tulosalue.textContent='';
    }
    async function laheta(hae){
        const numero=syote.value;
        if(numero<=0){
            paivitaStatus({ viesti: 'numero oli tyhjä', tyyppi: 'virhe' });
        }
        else{
            try {
                const optiot={
                    method:'POST',
                    body:JSON.stringify({numero}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                }
                const reitti = hae ?'/haeYksi':'/poista';
                const data = await fetch(reitti,optiot);
                const tulos = await data.json();

                if (tulos.viesti) {
                    paivitaStatus(tulos);
                } else {
                    paivitaTiedot(tulos);
                }
            } catch (virhe) {
                paivitaStatus({ viesti: virhe.message, tyyppi: 'virhe' });
            }
        }  
    } 
    function paivitaStatus(status){
        tulosalue.textContent = status.viesti;
        tulosalue.setAttribute('class', status.tyyppi);
    }

    function paivitaTiedot(kissa){
        tulosalue.innerHTML=`
        <p><span class="selite">Numero:</span> <span class="tieto">${kissa.numero}</span></p>
        <p><span class="selite">Nimi:</span> <span class="tieto"> ${kissa.nimi}</span></p>
        <p><span class="selite">Pituus:</span> <span class="tieto"> ${kissa.pituus}</span></p>
        <p><span class="selite">PainoKg:</span> <span class="tieto"> ${kissa.painoKg}</span></p>
        <p><span class="selite">Rotu:</span> <span class="tieto"> ${kissa.rotu}</span></p>
        `;
        tulosalue.removeAttribute('class');
    }

})();