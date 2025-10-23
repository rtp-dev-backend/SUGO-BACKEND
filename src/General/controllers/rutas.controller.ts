import { Request, Response } from 'express';
import { Rutas } from '../models/rutas.model';
import { RutaModalidades } from '../models/ruta_modalidades.model';
import { modalidad_autorizada } from '../models/modalidad_autorizada.model';

// Obtener todas las rutas con sus modalidades relacionadas
export const getAllRutas = async (req: Request, res: Response) => {
  try {
    const rutas = await Rutas.findAll({
      include: [
        {
          model: RutaModalidades,
          as: 'ruta_modalidades',
          include: [
            {
              model: modalidad_autorizada,
              as: 'modalidad',
            }
          ]
        }
      ]
    });
    return res.status(200).json(rutas);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener rutas', error });
  }
};

// Buscar una ruta por su nombre (string)
export const getRutaByString = async (req: Request, res: Response) => {
  const { ruta } = req.params;
  try {
    const resultado = await Rutas.findOne({ where: { ruta:ruta } });
    if (!resultado) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar ruta', error });
  }
};
