import pg from 'pg'; //npm install @types/pg
const { Pool } = pg;
const pool = new Pool({
    user: 'aksu',
    host: 'localhost',
    database: 'api',
    password: '1234123qwe',
    port: 5432
});
export const getAllFromTable = (tableName) => {
    return new Promise((fulfill, reject) => {
        //pool.query('SELECT * FROM $1 ORDER BY id ASC',[tableName], (error, results) => {
        pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            fulfill(results.rows);
        });
    });
};
export const getFromTableById = (tableName, getId) => {
    return new Promise((fulfill, reject) => {
        pool.query(`SELECT * FROM ${tableName} WHERE id = ${getId}`, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.rowCount === 0) {
                reject({ error: `ID: ${getId} does not exist in table ${tableName}` });
                return;
            }
            fulfill(results.rows[0]);
        });
    });
};
export const createAsiakas = (asiakas) => {
    const { nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka } = asiakas;
    return new Promise((fulfill, reject) => {
        pool.query('INSERT INTO asiakas (nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka) ' +
            'VALUES ($1, $2, $3, $4, $5) ' +
            'ON CONFLICT (nimi) DO NOTHING', //in order for conflict to work table has to have constraint.
        [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.rowCount === 0) {
                reject({ error: `Asiakas ${nimi} already exists in asiakas table` });
            }
            fulfill(results.rowCount);
        });
    });
};
//# sourceMappingURL=queries.js.map