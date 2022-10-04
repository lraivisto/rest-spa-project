`use strict`;

const { STATUSKOODIT, STATUSVIESTIT } = require(`./statuskoodit`);
const Tietokanta = require(`./tietokanta`);
const optiot = require(`./yhteysoptiot.json`);
const sql = require(`./sqllauseet.json`);
const haeKaikkiSql = sql.haeKaikki.join(` `);
const haeSql = sql.hae.join(` `);
const lisaaSql = sql.lisaa.join(` `);
const paivitaSql = sql.paivita.join(` `);
const poistaSql = sql.poista.join(` `);
const { insertParametrit, updateParametrit } = require(`./parametrifunktiot`);
const PERUSAVAIN = sql.perusavain;

module.exports = class Tietovarasto {
    constructor() { this.db = new Tietokanta(optiot); }

    get STATUSKOODIT() {
        return STATUSKOODIT;
    };

    haeKaikki() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.db.suoritaKysely(haeKaikkiSql);
                resolve(tulos.kyselynTulos);
            } catch (virhe) {
                reject(STATUSVIESTIT.OHJELMAVIRHE());
            }
        })
    }
    hae(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                reject(STATUSVIESTIT.EI_LOYTYNYT(`<---- Tyhjä ---->`));
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(haeSql, [id]);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos[0]);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(id))
                    }
                } catch (virhe) {
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    lisaa(uusi) {
        return new Promise(async (resolve, reject) => {
            try {
                if (uusi) {
                    if (!uusi[PERUSAVAIN]) {
                        reject(STATUSVIESTIT.EI_LISATTY());
                    } else {
                        const hakutulos =
                            await this.db.suoritaKysely(haeSql, [uusi[PERUSAVAIN]]);
                        if (hakutulos.kyselynTulos.length > 0) {
                            reject(STATUSVIESTIT.JO_KAYTOSSA(uusi[PERUSAVAIN]));
                        } else {
                            const status =
                                await this.db.suoritaKysely(lisaaSql, insertParametrit(uusi));
                            resolve(STATUSVIESTIT.LISAYS_OK(uusi[PERUSAVAIN]));
                        }
                    }
                } else {
                    reject(STATUSVIESTIT.EI_LISATTY());
                }
            } catch (virhe) {
                reject(STATUSVIESTIT.EI_LISATTY());
            }
        });
    }
    poista(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                reject(STATUSVIESTIT.EI_LOYTYNYT(`<---- Tyhjä ---->`));
            } else {
                try {
                    const status = await this.db.suoritaKysely(poistaSql, [id]);
                    if (status.kyselynTulos.muutetutRivitLkm === 0) {
                        resolve(STATUSVIESTIT.EI_POISTETTU());
                    } else {
                        resolve(STATUSVIESTIT.POISTO_OK(id));
                    }
                } catch (virhe) {
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    paivita(avain, muutettuOlio) {
        return new Promise(async (resolve, reject) => {
            try {
                if (avain && muutettuOlio) {
                    if (muutettuOlio[PERUSAVAIN] != avain) {
                        reject(STATUSVIESTIT.AVAIMET_EI_SAMAT(avain, muutettuOlio[PERUSAVAIN]));
                    } else {
                        const tulosGet = await this.db.suoritaKysely(haeSql, [avain]);
                        if (tulosGet.kyselynTulos.length > 0) {
                            const status = await this.db.suoritaKysely(paivitaSql, updateParametrit(muutettuOlio));
                            if (status.kyselynTulos.muutetutRivitLkm === 0) {
                                resolve(STATUSVIESTIT.EI_PAIVITETTY());
                            } else {
                                resolve(STATUSVIESTIT.PAIVITYS_OK(muutettuOlio[PERUSAVAIN]));
                            }
                        } else {
                            this.lisaa(muutettuOlio)
                                .then(status => resolve(status))
                                .catch(virhe => reject(virhe));
                        }
                    }
                } else {
                    reject(STATUSVIESTIT.EI_PAIVITETTY());
                }
            } catch (virhe) {
                reject(STATUSVIESTIT.EI_PAIVITETTY());
            }
        });
    }
}