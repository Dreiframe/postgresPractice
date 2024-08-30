/*
import pg from 'pg' //npm install @types/pg
const { Pool } = pg;

const pool = new Pool({
    user: 'aksu',
    host: 'localhost',
    database: 'api',
    password: '1234123qwe',
    port: 5432
});
*/
import {pool} from '../connection/sqlConnection.js'


export const getAllFromTable = (tableName: string) => {
    return new Promise((fulfill, reject) => {
        pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
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
        pool.query(`SELECT * FROM ${tableName} WHERE id = ${getId}`, (error, results) => {
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
    pool.query(`DELETE FROM ${tableName} WHERE id = ${deleteId}`, (error, results) => {
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
            'WHERE id = $6',
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