import { Request, Response } from 'express';
import { createRaakaAine, updateRaakaAineById } from '../queries/raakaAineQueries.js';

import Joi from 'joi';
const raakaAineSchema = Joi.object({
    nimi: Joi.string().min(2).max(200).required()
});


export const postRaakaAine = async (req: Request, res: Response) => {
    const validationResult = raakaAineSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    };

    
    try {
        await createRaakaAine(validationResult.value);
        res.status(200).json({message: `Raaka-aine ${validationResult.value.nimi} added!`}) 
    } catch (error) {
        res.status(500).json(error);
        return;
    };
};

export const putRaakaAine = async (req: Request, res: Response) => {
    const updateId = parseInt(req.params.id);
    const validationResult = raakaAineSchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    };

    
    try {
        await updateRaakaAineById(updateId, validationResult.value);
        res.status(200).json({message: 'Raaka-aine updated!'}) 
    } catch (error) {
        res.status(500).json(error);
        return;
    };
};