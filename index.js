// IMPORTS AND SETUP -----------------------------------------------------------------
//import * as express from 'express';
import express, { json } from "express";
const app = express();
app.use(json());
import morgan from 'morgan'; //npm install @types/morgan
app.use(morgan('tiny'));
// /api/asiakas ----------------------------------------------------------------------
import { getAllAsiakkaat, getAsiakasById, postAsiakas } from './services/asiakas.js';
app.get('/api/asiakas', getAllAsiakkaat);
app.get('/api/asiakas/:id', getAsiakasById);
app.post('/api/asiakas', postAsiakas);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map