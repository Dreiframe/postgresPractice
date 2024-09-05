import { Request, Response } from 'express'
//import { getAllFromTable, getFromTableById, deleteFromTableById } from '../queries/queries.js'
import { getAllFromTable, getFromTableById, deleteFromTableById } from '../queries/generalQueries.js'

import { createAsiakas, updateAsiakasById } from '../queries/asiakasQueries.js';

import Joi from 'joi';

const asiakasSchema = Joi.object({
    nimi: Joi.string().required().max(200),
    puhelinnumero: Joi.string().required().max(20),
    katuosoite: Joi.string().required().max(50),
    postinumero: Joi.number(),
    postitoimipaikka: Joi.string().required().max(20),
})


export const getAllAsiakkaat = async (req: Request, res: Response) => {
    try{
        const queryResponse = await getAllFromTable('asiakas');
        res.status(200).json(queryResponse);
        return;
    } catch (error) {
        res.status(500).json(error);
        return;
    } 
}


export const getAsiakasById = async (req: Request, res: Response) => {
    const getId: number = parseInt(req.params.id);
    try {
        const queryResponse = await getFromTableById('asiakas', getId);
        res.status(200).json(queryResponse);
        return;
    } catch (error) {
        res.status(500).json(error);
        return;
    } 
}


export const deleteAsiakasById = async (req: Request, res: Response) => {
    const deleteId = parseInt(req.params.id);

    try {
        await deleteFromTableById('asiakas', deleteId);
        res.status(200).json({message: `Asiakas with ID: ${deleteId} deleted!`});
        return;
    } catch (error) {
        res.status(500).json(error);
        return;
    } 
};


export const postAsiakas = async (req: Request, res: Response) => {
    const validationResult = asiakasSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    
    try {
        await createAsiakas(validationResult.value)
        res.status(200).json({message: `Asiakas ${validationResult.value.nimi} added!`}) 
    } catch (error) {
        res.status(500).json(error);
        return;
    }
}


export const updateAsiakas = async (req: Request, res: Response) => {
    const updateId = parseInt(req.params.id);
    const validationResult = asiakasSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    try {
        await updateAsiakasById(updateId, validationResult.value);
        res.status(200).json({message: `Asiakas ${validationResult.value.nimi} updated!`});
    } catch (error) {
        res.status(500).json(error);
        return;
    }
}