import { pool } from '../connection/sqlConnection.js'


export const getAllFromTableOrderByColumn = (tableName: string, columnName: string) => {
    return new Promise((fulfill, reject) => {
        pool.query(`SELECT * FROM ${tableName} ORDER BY ${columnName} ASC`, (error, results) => {
            if (error) {
                reject(error);
                return;
            };
    
            fulfill(results.rows);
        });
    });
};


export const getFromTableById = (tableName: string, getId: number) => {
    return new Promise((fulfill, reject) => {
        pool.query(`SELECT * FROM ${tableName} WHERE ${tableName}_id = ${getId}`, (error, results) => {
            if (error){
                reject(error);
                return;
            };

            if (results.rowCount === 0){
                reject({error: `ID: ${getId} does not exist in table ${tableName}`});
                return;
            };

            fulfill(results.rows[0]);
        });
    });
};


export const deleteFromTableById = (tableName: string, deleteId: number) => {
    return new Promise((fulfill, reject) => {
    pool.query(`DELETE FROM ${tableName} WHERE ${tableName}_id = ${deleteId}`, (error, results) => {
            if (error){
                reject(error);
                return;
            };
            
            if (results.rowCount === 0){
                reject({error: `ID: ${deleteId} does not exist in table ${tableName}`});
                return;
            };

            fulfill(results);
        });
    });
};
