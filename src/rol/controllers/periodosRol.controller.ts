import { Request, Response } from 'express';
import { PeriodosRol } from '../models/periodosRol.model';

// Obtener todos los periodos
export const getPeriodos = async (req: Request, res: Response) => {
  try {
    const periodos = await PeriodosRol.findAll();
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los periodos', error });
  }
};

