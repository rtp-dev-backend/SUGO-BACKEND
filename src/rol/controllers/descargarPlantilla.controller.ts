import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const descargarPlantilla = (req: Request, res: Response) => {
  // Ruta absoluta al archivo Excel de la plantilla, compatible con dev y prod
  const filePath = path.join(process.cwd(), 'src', 'rol', 'templates', 'Programacion_del_Servicio.xlsx');
  console.log('Intentando descargar plantilla desde:', filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Archivo NO encontrado:', filePath);
      return res.status(404).json({ message: 'Archivo de plantilla no encontrado', error: err.message });
    }
    console.log('Archivo encontrado, iniciando descarga:', filePath);
    res.download(filePath, 'Programacion_Servicio.xlsx', (err) => {
      if (err) {
        console.error('Error al descargar la plantilla:', err);
        res.status(500).json({ message: 'Error al descargar la plantilla', error: err.message });
      }
    });
  });
};
