import { Request, Response } from 'express';
import { createAnnos, updateAnnosById } from '../queries/annosQueries.js';
import { createRelationAnnosRaakaAine, showAllAnnosRaakaAine } from '../queries/relationQueries.js';


import Joi from 'joi';
const annosSchema = Joi.object({
    ravintola_id: Joi.number().required(),
    nimi: Joi.string().min(3).max(200).required(),
    koko: Joi.string().min(3).max(30).required(),
    hinta: Joi.number().positive().required()
});

const bodySchema = Joi.object({
    annos: annosSchema,
    raakaaine: Joi.array().items(Joi.number())
});


export const postAnnos = async (req: Request, res: Response) => {
    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error){
        return res.status(400).json({
            "error": validationResult.error.details[0].message
        });
    };

    // createAnnos creates new annos and returns the new annos id.
    // after creating annos we create the relation between annos and raakaaine*multiple
    try {
        await createAnnos(validationResult.value.annos).then(annos_id => {
                validationResult.value.raakaaine.map(raakaaine_id =>
                    createRelationAnnosRaakaAine(annos_id, raakaaine_id)
                );
        });

        res.status(200).json({"message": 'Annos added!'}) 
    } catch (error) {
        res.status(500).json({"error": error});
        return;
    }
};


export const putAnnos = async (req: Request, res: Response) => {
    const updateId = parseInt(req.params.id);
    const validatedAnnos = annosSchema.validate(req.body);

    if (validatedAnnos.error){
        return res.status(400).json({
            "error": validatedAnnos.error.details[0].message
        });
    };

    try {
        await updateAnnosById(updateId, validatedAnnos.value);
        res.status(200).json({"message": 'Annos updated!'}) 
    } catch (error) {
        res.status(500).json({"error": error});
        return;
    }
};


export const getAllAnnosRaakaAine = async (req: Request, res: Response) => {
    try {
        const queryResults = await showAllAnnosRaakaAine();
        res.status(200).json({"message": queryResults}) 
    } catch (error) {
        res.status(500).json({"error": error});
        return;
    }
};