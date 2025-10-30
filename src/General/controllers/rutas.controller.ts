import { Request, Response } from 'express';
import { Rutas } from '../models/rutas.model';
import { RutaModalidades } from '../models/ruta_modalidades.model';
import { Modalidades } from '../models/modalidades.model';

// Obtener todas las rutas con sus modalidades relacionadas
export const getAllRutas = async (req: Request, res: Response) => {
  try {
    const rutas = await RutaModalidades.findAll({
      attributes: ['id'],
      include: [
        { 
          model: Rutas, 
          as: 'ruta', 
          attributes: ['ruta', 'origen', 'origen_nomenclatura', 'destino', 'destino_nomenclatura', 'modulo']
        },
        { model: Modalidades, as: 'modalidad', attributes: ['name'] }
      ]
    });

    // Agrupar por módulo
    const agrupadoPorModulo = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    rutas.forEach(item => {
      const rutaObj = item['ruta'];
      const modalidadObj = item['modalidad'];
      const modulo = rutaObj?.modulo;
      if (agrupadoPorModulo[modulo]) {
        // Buscar si la ruta ya existe en el array del módulo
        let rutaExistente = agrupadoPorModulo[modulo].find(r => r.ruta === rutaObj.ruta);
        if (!rutaExistente) {
          rutaExistente = {
            ruta: rutaObj.ruta,
            origen: rutaObj.origen,
            origen_nomenclatura: rutaObj.origen_nomenclatura,
            destino: rutaObj.destino,
            destino_nomenclatura: rutaObj.destino_nomenclatura,
            modalidades: []
          };
          agrupadoPorModulo[modulo].push(rutaExistente);
        }
        // Agregar modalidad si no está
        if (!rutaExistente.modalidades.includes(modalidadObj.name)) {
          rutaExistente.modalidades.push(modalidadObj.name);
        }
      }
    });
    return res.status(200).json(agrupadoPorModulo);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener rutas/modalidades', error });
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
