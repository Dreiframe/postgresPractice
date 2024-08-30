import pg from 'pg' //npm install @types/pg
const { Pool } = pg;

export const pool = new Pool({
    user: 'aksu',
    host: 'localhost',
    database: 'api2',
    password: '1234123qwe',
    port: 5432
});
