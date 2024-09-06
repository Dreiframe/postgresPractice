import { error } from 'console';
import { pool } from '../connection/sqlConnection.js';

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


export const showAllAnnosRaakaAine = () => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'SELECT annos.nimi AS annos, raakaaine.nimi AS raakaaine '+
            'FROM annos, raakaaine, annosraakaaine '+
            'WHERE annos.annos_id = annosraakaaine.annos_id '+
            'AND raakaaine.raakaaine_id = annosraakaaine.raakaaine_id;',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                fulfill(results);
            }
        )
    });
};


/*
export const createRelationTilausAnnos = (annos_id:number, raakaaine_id:number) => {
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
*/