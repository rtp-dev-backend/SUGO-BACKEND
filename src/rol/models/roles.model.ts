/**
 * Modelo Sequelize para la tabla 'roles'.
 *
 * Representa el encabezado de un rol cargado, con relaciones a:
 * - El archivo de carga (CargasArchivosRol)
 * - Los servicios asociados (Servicios)
 * - Los cubredescansos asociados (Cubredescansos)
 * - Las jornadas excepcionales asociadas (JornadasExcepcionales)
 *
 * Relaciones:
 * - Roles pertenece a CargasArchivosRol (archivo_id)
 * - Roles tiene muchos Servicios (rol_id)
 * - Roles tiene muchos Cubredescansos (rol_id)
 * - Roles tiene muchas JornadasExcepcionales (rol_id)
 *
 * Campos:
 * - id: Identificador único del rol
 * - archivo_id: FK al archivo de carga
 * - periodo: FK al periodo (periodos_rol)
 * - id_ruta: (puede ser FK a rutas, depende del modelo)
 * - modulo: FK al módulo (catalogo_modulos)
 * - notas: Observaciones o notas del rol
 * - created_at, updated_at: Timestamps
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { CargasArchivosRol } from "./cargasArchivosRol.model";
import { Servicios } from "./servicios.model";
import { Cubredescansos } from "./cubredescansos.model";
import { JornadasExcepcionales } from "./jornadasExcepcionales.model";

export const Roles = SUGO_sequelize_connection.define('roles', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  archivo: { type: DataTypes.BIGINT, allowNull: true },
  periodo: DataTypes.TEXT,
  ruta: DataTypes.TEXT,
  modulo: DataTypes.INTEGER,
  notas: DataTypes.TEXT,
  dias_impar: DataTypes.TEXT, // Días impar
  dias_par: DataTypes.TEXT,   // Días par
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

CargasArchivosRol.hasMany(Roles, { foreignKey: 'archivo', sourceKey: 'id' });
Roles.belongsTo(CargasArchivosRol, { foreignKey: 'archivo', targetKey: 'id' });

Roles.hasMany(Servicios, { foreignKey: 'rol_id', sourceKey: 'id' });
Servicios.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(Cubredescansos, { foreignKey: 'rol_id', sourceKey: 'id' });
Cubredescansos.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(JornadasExcepcionales, { foreignKey: 'rol_id', sourceKey: 'id' });
JornadasExcepcionales.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });