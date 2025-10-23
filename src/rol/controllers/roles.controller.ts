import { Request, Response } from 'express';
import { obtenerRolesPorPeriodo } from '../services/roles.service';

export const rolesPorPeriodo = async (req: Request, res: Response) => {
  try {
    const periodoId = req.body?.periodoId;
    const roles = await obtenerRolesPorPeriodo(periodoId);
    return res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles por periodo', error);
    return res.status(500).json({ message: 'Error al obtener roles', error });
  }
};
