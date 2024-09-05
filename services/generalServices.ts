import { Request, Response } from 'express';
import { getAllFromTable, getFromTableById, deleteFromTableById } from '../queries/generalQueries.js';


const allowedTableName = (tableName: string): boolean => {
    if (
        tableName === 'asiakas' ||
        tableName === 'ravintola' ||
        tableName === 'tilaus'
    ) {
        return true;
    }

    return false;
}


export const getAllByTable = async (req: Request, res: Response) => {
    const tableName = req.params.table;

    if (allowedTableName(tableName) === false) {
        res.status(400).json({message: 'Table name is not valid!'})
        return;
    }

    try {
        const queryResponse = await getAllFromTable(tableName);
        res.status(200).json(queryResponse);
    } catch (error) {
        res.status(500).json(error);
    }
};


export const getByIdFromTable = async (req: Request, res:Response) => {
    const getId: number = parseInt(req.params.id);
    const tableName = req.params.table;

    if (allowedTableName(tableName) === false) {
        res.status(400).json({message: 'Table name is not valid!'})
        return;
    }

    try {
        const queryResponse = await getFromTableById(tableName, getId);
        res.status(200).json(queryResponse);

    } catch (error) {
        res.status(500).json(error);
    }
};


export const deleteByIdFromTable= async (req: Request, res:Response) => {
    const deleteId: number = parseInt(req.params.id);
    const tableName = req.params.table;

    if (allowedTableName(tableName) === false) {
        res.status(400).json({message: 'Table name is not valid!'})
        return;
    }

    try {
        await deleteFromTableById(tableName, deleteId);
        res.status(200).json({message: `${tableName} with ID: ${deleteId} deleted!`});
    } catch (error) {
        res.status(500).json(error);
    }
}
