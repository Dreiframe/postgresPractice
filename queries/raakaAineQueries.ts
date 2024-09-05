import { pool } from '../connection/sqlConnection.js'

type raakaAineType = {
    nimi: string
}

export const createRaakaAine = (raakaAine: raakaAineType) => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'INSERT INTO raakaaine (nimi) VALUES ($1)',
            [raakaAine.nimi],
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


export const updateRaakaAineById = (updateId: number, raakaAine: raakaAineType) => {
    return new Promise((fulfill, reject) => {
        pool.query(
            'UPDATE raakaaine SET nimi = $1 ' +
            'WHERE raakaaine_id = $2',
            [raakaAine.nimi, updateId],
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