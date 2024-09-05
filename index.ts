// IMPORTS AND SETUP -----------------------------------------------------------------
//import * as express from 'express';
import express, { Express, json } from "express";
const app: Express = express();
app.use(json());

import morgan from 'morgan'; //npm install @types/morgan
app.use(morgan('tiny'));


// /api/asiakas ----------------------------------------------------------------------
import { getAllAsiakkaat, getAsiakasById, postAsiakas, updateAsiakas, deleteAsiakasById } from './services/asiakas.js';
//app.get('/api/asiakas', getAllAsiakkaat);
//app.get('/api/asiakas/:id', getAsiakasById);
//app.delete('/api/asiakas/:id', deleteAsiakasById);
app.post('/api/asiakas', postAsiakas);
app.put('/api/asiakas/:id', updateAsiakas);

// /api/ravintola ---------------------------------------------------------------------
import { getAllRavintolat, getRavintolaById, postRavintola, deleteRavintolaById, updateRavintola } from './services/ravintola.js';
//app.get('/api/ravintola', getAllRavintolat);
//app.get('/api/ravintola/:id', getRavintolaById);
//app.delete('/api/ravintola/:id', deleteRavintolaById);
app.post('/api/ravintola', postRavintola);
app.put('/api/ravintola/:id', updateRavintola);


// /api/tilaus -----------------------------------------------------------------------
import { postTilaus, putTilaus } from './services/tilaus.js';
app.post('/api/tilaus', postTilaus);
app.put('/api/tilaus/:id', putTilaus);

// /api/GENERAL ----------------------------------------------------------------------
import { getAllByTable, getByIdFromTable, deleteByIdFromTable } from './services/generalServices.js'
app.get('/api/:table', getAllByTable);
app.get('/api/:table/:id', getByIdFromTable);
app.delete('/api/:table/:id', deleteByIdFromTable);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});