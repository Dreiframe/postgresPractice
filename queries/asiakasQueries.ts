import { pool } from '../connection/sqlConnection.js'

type asiakasType = {
    nimi: string, 
    puhelinnumero: string, 
    katuosoite: string, 
    postinumero: number, 
    postitoimipaikka: string,
};


export const createAsiakas = (asiakas: asiakasType) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = asiakas;

    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO asiakas (nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka) ' + 
            'VALUES ($1, $2, $3, $4, $5) ' + 
            'ON CONFLICT (nimi) DO NOTHING', //in order for conflict to work the table has to have constraint.
            [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka],
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                };

                if (results.rowCount === 0){
                    reject({error: `Asiakas ${nimi} already exists in asiakas table`});
                };
               
                fulfill(results);
            }
        );
    });
};


export const updateAsiakasById = (updateId: number, asiakas: asiakasType) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = asiakas;

    return new Promise((fulfill, reject) => {
        pool.query(
            'UPDATE asiakas SET ' +
            'nimi = $1, puhelinnumero = $2, katuosoite = $3, postinumero = $4, postitoimipaikka = $5 ' +
            'WHERE asiakas_id = $6',
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