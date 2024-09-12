import { Request, Response } from 'express';
import { createTilaus, updateTilausById } from '../queries/tilausQueries.js';
import { showAllTilausAnnos, createRelationTilausAnnos } from '../queries/relationQueries.js';

import Joi from 'joi';
const tilausSchema = Joi.object({
    asiakas_id: Joi.number().required(),
    kuljetustapa: Joi.string().min(2).max(40).required(),
    vastaanotettu: Joi.boolean().required(),
    toimitettu: Joi.boolean().required()
});

const bodySchema = Joi.object({
    tilaus: tilausSchema.required(),
    annos: Joi.array().items(Joi.number()).required()
});


export const postTilaus = async (req: Request, res: Response) => {
    const validationResult = bodySchema.validate(req.body);
    
    if (validationResult.error){
        return res.status(400).json({
            "error": validationResult.error.details[0].message
        });
    };

    // createTilaus creates new tilaus and returns the newly created tilaus id.
    // after creating tilaus we create the relation between tilaus and annos*multiple
    try {
        await createTilaus(validationResult.value.tilaus).then(tilaus_id => {
            validationResult.value.annos.map(annos_id => {
                createRelationTilausAnnos(tilaus_id, annos_id);
            });
        });
    } catch (error) {
        res.status(500).json({"error": error});
        return;
    }
};


export const putTilaus = async (req: Request, res: Response) => {
    const updateId = parseInt(req.params.id);
    const validatedTilaus = tilausSchema.validate(req.body);

    if (validatedTilaus.error){
        return res.status(400).json({
            error: validatedTilaus.error.details[0].message
        });
    };

    try {
        await updateTilausById(updateId, validatedTilaus.value);
        res.status(200).json({message: 'tilaus updated!'}) 
    } catch (error) {
        res.status(500).json({error: error});
        return;
    }
};


export const getAllTilausAnnos = async (req: Request, res: Response) => {
    try {
        const queryResults = await showAllTilausAnnos();
        res.status(200).json({"message": queryResults}) 
    } catch (error) {
        res.status(500).json({"error": error});
        return;
    }
};