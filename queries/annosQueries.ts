import { pool } from '../connection/sqlConnection.js'

type annosType = {
    ravintola_id: number,
    nimi: string,
    koko: string,
    hinta: number
};


//create annos probably needs to also create the annosraakaaine relation
export const createAnnos = (annos:  annosType): Promise<number> => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO annos(ravintola_id, nimi, koko, hinta) ' + 
            'VALUES ($1, $2, $3, $4) ' + 
            'RETURNING annos_id',
            [annos.ravintola_id, annos.nimi, annos.koko, annos.hinta],
            (error, results) => {
                if (error){
                    reject(error);
                    return;
                };

                fulfill(results.rows[0].annos_id);
                return;
            }
        );
    });
};


export const updateAnnosById = (updateId: number, annos: annosType) => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'UPDATE annos SET ' +
            'ravintola_id = $1, nimi = $2, koko = $3, hinta = $4 ' +
            'WHERE annos_id = $5;',
            [annos.ravintola_id, annos.nimi, annos.koko, annos.hinta, updateId],
            (error, results) => {
                if (error){
                    reject(error);
                    return;
                };

                fulfill(results);
                return;
            }
        );
    });
};