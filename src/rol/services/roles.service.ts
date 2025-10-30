// Importación de modelos principales y relaciones
import { Roles } from '../models/roles.model';
import { servicios } from '../models/servicios.model';
import { operadoresServicio } from '../models/operadoresServicio.model';
import { horarios } from '../models/horarios.model';
import { cubredescansos } from '../models/cubredescansos.model';
import { cubredescansosTurnos } from '../models/cubredescansosTurnos.model';
import { jornadasExcepcionales } from '../models/jornadasExcepcionales.model';
import { cargasArchivosRol } from '../models/cargasArchivosRol.model';
import { Rutas } from '../../General/models/rutas.model';
import { RutaModalidades } from '../../General/models/ruta_modalidades.model';
import { Modalidades } from '../../General/models/modalidades.model';

export async function obtenerRolesPorPeriodo(periodoId: number) {
  // Validación del parámetro recibido
  if (periodoId === undefined || periodoId === null || Number.isNaN(Number(periodoId))) {
    throw new Error('periodoId inválido');
  }

  // Consulta principal de roles por periodo, incluyendo todas las relaciones necesarias
  // Consulta principal de roles por periodo, incluyendo todas las relaciones necesarias
  const roles = await Roles.findAll({
    where: { periodo: periodoId },
    include: [
      // Incluye el archivo cargado relacionado
      { model: cargasArchivosRol, required: false },
      // Incluye la relación con ruta_modalidades, y a su vez con rutas y modalidades
      {
        model: RutaModalidades,
        required: false,
        include: [
          { model: Rutas, as: 'ruta', required: false }, // Relación indirecta con rutas usando alias
          { model: Modalidades, as: 'modalidad', required: false } // Relación indirecta con modalidades usando alias
        ]
      },
      // Incluye los servicios y sus relaciones
      {
        model: servicios,
        required: false,
        include: [
          { model: operadoresServicio, required: false },
          { model: horarios, required: false },
        ],
      },
      // Incluye cubredescansos y sus turnos
      {
        model: cubredescansos,
        required: false,
        include: [
          { model: cubredescansosTurnos, required: false },
        ],
      },
      // Incluye jornadas excepcionales
      { model: jornadasExcepcionales, required: false },
    ],
    order: [['id', 'ASC']],
  });
  // Serializa la respuesta para enviar toda la información al frontend
  return roles.map(r => r.toJSON());
}
