import { pool } from '../connection/sqlConnection.js'

type tilausType = {
    asiakas_id: number,
    kuljetustapa: string,
    vastaanotettu: boolean,
    toimitettu: boolean,
};


export const createTilaus = (tilaus: tilausType): Promise<number> => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO tilaus(asiakas_id, aika, kuljetustapa, vastaanotettu, toimitettu) ' + 
            'VALUES ($1, now(), $2, $3, $4) ' +
            'RETURNING tilaus_id',
            [tilaus.asiakas_id, tilaus.kuljetustapa, tilaus.vastaanotettu, tilaus.toimitettu],
            (error, results) => {
                if (error){
                    reject(error);
                    return;
                };

                fulfill(results.rows[0].tilaus_id);
            }
    );
    });
};


export const updateTilausById = (updateId: number, tilaus: tilausType) => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'UPDATE tilaus SET ' +
            'asiakas_id = $1, aika = now(), kuljetustapa = $2, vastaanotettu = $3, toimitettu = $4 ' +
            'WHERE tilaus_id = $5;',
            [tilaus.asiakas_id, tilaus.kuljetustapa, tilaus.vastaanotettu, tilaus.toimitettu, updateId],
            (error, results) => {
                if (error){
                    reject(error);
                    return;
                };

                fulfill(results);
            }
        );
    });
};