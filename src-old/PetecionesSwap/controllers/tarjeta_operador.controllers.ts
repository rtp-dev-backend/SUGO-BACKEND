import { Request, Response } from 'express';
import { getTjtOpData } from '../services/tarjeta_operador.services';


interface Query { modulo: number, inicio: string, fin: string }
export const GetTarjeta_operador = async (req: Request, res: Response) => {
    const { modulo, inicio, fin } = req.query as unknown as Query;

    try {
        const data = await getTjtOpData(modulo, inicio, fin)
       
        res.send({ data })
    } catch (error) {
        res.json({ error: (error as  Error).message })
    }
};
