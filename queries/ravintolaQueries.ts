import { pool } from '../connection/sqlConnection.js'

type ravintolaType = {
    nimi: string, 
    puhelinnumero: string, 
    katuosoite: string, 
    postinumero: number, 
    postitoimipaikka: string,
};


export const createRavintola = (ravintola: ravintolaType) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = ravintola;

    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO ravintola (nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka) ' + 
            'VALUES ($1, $2, $3, $4, $5) ' + 
            'ON CONFLICT (nimi) DO NOTHING', //in order for conflict to work the table has to have constraint.
            [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka],
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                };

                if (results.rowCount === 0){
                    reject({error: `ravintola ${nimi} already exists in ravintola table`});
                };
               
                fulfill(results);
            }
        );
    });
};


// update by id could be moved to qeneralQueries, though it only works for ravintola/asiakas..
export const updateRavintolaById = (updateId: number, ravintola: ravintolaType) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = ravintola;

    return new Promise((fulfill, reject) => {
        pool.query(
            'UPDATE ravintola SET ' +
            'nimi = $1, puhelinnumero = $2, katuosoite = $3, postinumero = $4, postitoimipaikka = $5 ' +
            'WHERE ravintola_id = $6',
            //'ON NOT CONFLICT (nimi) DO NOTHING',
            [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka, updateId],
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                };

                fulfill(results);
            }
        );
    });
};