/**
 * Modelo Sequelize para la tabla 'cargas_archivos_rol'.
 *
 * Representa el archivo cargado por el usuario, que puede contener uno o varios roles.
 *
 * Relaciones:
 * - CargasArchivosRol tiene muchos Roles (archivo_id)
 *
 * Campos:
 * - id: Identificador único del archivo
 * - nombre_archivo: Nombre del archivo subido
 * - subido_por: Id del usuario que subió el archivo
 * - created_at, updated_at: Timestamps
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";

export const CargasArchivosRol = SUGO_sequelize_connection.define('cargas_archivos_rol', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre_archivo: DataTypes.TEXT,
  subido_por: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'cargas_archivos_rol',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});