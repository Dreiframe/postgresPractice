import { Request, Response } from 'express';
import { getAllFromTableOrderByColumn, getFromTableById, deleteFromTableById } from '../queries/generalQueries.js';
import { createRavintola, updateRavintolaById } from '../queries/ravintolaQueries.js';

import Joi from 'joi';
const ravintolaSchema = Joi.object({
    nimi: Joi.string().required().max(200),
    puhelinnumero: Joi.string().required().max(20),
    katuosoite: Joi.string().required().max(50),
    postinumero: Joi.number(),
    postitoimipaikka: Joi.string().required().max(20),
});


export const getAllRavintolat = async (req: Request, res:Response) => {
    try {
        const queryResponse = await getAllFromTableOrderByColumn('ravintola', 'ravintola_id');
        res.status(200).json(queryResponse);
    } catch (error) {
        res.status(500).json(error);
    }
};


export const getRavintolaById = async (req: Request, res:Response) => {
    const getId: number = parseInt(req.params.id);
    try {
        const queryResponse = await getFromTableById('ravintola', getId);
        res.status(200).json(queryResponse);

    } catch (error) {
        res.status(500).json(error);
    }
};


export const deleteRavintolaById = async (req: Request, res:Response) => {
    const deleteId: number = parseInt(req.params.id);

    try {
        await deleteFromTableById('ravintola', deleteId);
        res.status(200).json({message: `Ravintola with ID: ${deleteId} deleted!`});
    } catch (error) {
        res.status(500).json(error);
    }
}


export const postRavintola = async (req: Request, res:Response) => {
    const validationResult = ravintolaSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    
    try {
        await createRavintola(validationResult.value)
        res.status(200).json({message: `Ravintola ${validationResult.value.nimi} added!`}) 
    } catch (error) {
        res.status(500).json(error);
        return;
    }
};


export const updateRavintola = async (req: Request, res: Response) => {
    const updateId = parseInt(req.params.id);
    const validationResult = ravintolaSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    try {
        await updateRavintolaById(updateId, validationResult.value);
        res.status(200).json({message: `Ravintola ${validationResult.value.nimi} updated!`});
    } catch (error) {
        res.status(500).json(error);
        return;
    }
}