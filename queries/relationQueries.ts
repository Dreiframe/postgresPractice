import { pool } from '../connection/sqlConnection.js';


export const showAllAnnosRaakaAine = () => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'SELECT annos.annos_id AS annos_id, annos.nimi AS annos, raakaaine.nimi AS raakaaine '+
            'FROM annos, raakaaine, annosraakaaine '+
            'WHERE annos.annos_id = annosraakaaine.annos_id '+
            'AND raakaaine.raakaaine_id = annosraakaaine.raakaaine_id;',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                fulfill(results.rows);
            }
        )
    });
};


export const createRelationAnnosRaakaAine = (annos_id:number, raakaaine_id:number) => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO annosraakaaine(annos_id, raakaaine_id) ' +
            'VALUES ($1, $2)',
            [annos_id, raakaaine_id],
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                fulfill(results);
            }
        );
    });
};


export const showAllTilausAnnos = () => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'SELECT asiakas.nimi AS asiakas, tilaus.tilaus_id as tilaus, annos.nimi AS annos '+
            'FROM asiakas, tilaus, tilausannos, annos '+
            'WHERE asiakas.asiakas_id = tilaus.asiakas_id '+
            'AND tilausAnnos.tilaus_id = tilaus.tilaus_id '+
            'AND annos.annos_id = tilausannos.annos_id;' ,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                fulfill(results.rows);
        });
    });
}