import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"
import { pv_estados } from "./pv_estados.model.js"

export interface ViewPV {
    eco: number;
    modulo?: number;
    modulo_desc?: string;
    estatus?: number;
    fecha_alta?: Date;
    resguardatario?: number;
    matricula?: string;
    matricula_cantidad?: number;
    estado_fisico?: number;
    estado_fisico_desc?: string;
    servicio_modalidad_sicab?: string;
    servicio_modalidad_sicab_tarifa?: number;
    servicio_tipo?: string;
    vehiculo_tipo?: string;
    vehiculo_modelo?: number;
    puertas?: number;
    capacidad_sentados?: number;
    capacidad_parados?: number;
    chasis_cve?: string;
    chasis_marca?: string;
    chasis_modelo?: string;
    carroceria_marca?: string;
    carroceria_modelo?: string;
    carroceria_num?: string;
    motor_modelo?: string;
    motor_serie?: string;
    motor_cilindros?: number;
    transmision_modelo?: string;
    transmision_serie?: string;
    pertenencia?: string;
    factura?: string;
    proveedor?: string;
    contrato?: string;
    expediente?: string;
    fecha_compra?: Date;
    inversion?: number;
  }
  
  export const view_pv = SUGO_sequelize_connection.define<any, ViewPV>(
    'view_pv',
    {
      eco: { type: DataTypes.INTEGER, primaryKey: true },
      modulo: DataTypes.INTEGER,
      modulo_desc: DataTypes.STRING,
      estatus: DataTypes.INTEGER,
      fecha_alta: DataTypes.DATE,
      resguardatario: DataTypes.INTEGER,
      matricula: DataTypes.STRING,
      matricula_cantidad: DataTypes.INTEGER,
      estado_fisico: DataTypes.INTEGER,
      estado_fisico_desc: DataTypes.STRING,
      servicio_modalidad_sicab: DataTypes.STRING,
      servicio_modalidad_sicab_tarifa: DataTypes.DOUBLE,
      servicio_tipo: DataTypes.STRING,
      vehiculo_tipo: DataTypes.STRING,
      vehiculo_modelo: DataTypes.INTEGER,
      puertas: DataTypes.INTEGER,
      capacidad_sentados: DataTypes.INTEGER,
      capacidad_parados: DataTypes.INTEGER,
      chasis_cve: DataTypes.STRING,
      chasis_marca: DataTypes.STRING,
      chasis_modelo: DataTypes.STRING,
      carroceria_marca: DataTypes.STRING,
      carroceria_modelo: DataTypes.STRING,
      carroceria_num: DataTypes.STRING,
      motor_modelo: DataTypes.STRING,
      motor_serie: DataTypes.STRING,
      motor_cilindros: DataTypes.INTEGER,
      transmision_modelo: DataTypes.STRING,
      transmision_serie: DataTypes.STRING,
      pertenencia: DataTypes.STRING,
      factura: DataTypes.STRING,
      proveedor: DataTypes.STRING,
      contrato: DataTypes.STRING,
      expediente: DataTypes.STRING,
      fecha_compra: DataTypes.DATE,
      inversion: DataTypes.DECIMAL(12, 2),
    },
    {
      tableName: 'view_pv',
      schema: 'public',
      timestamps: false,
    }
  );
  

// Relación desde pv_estados a view_pv
pv_estados.belongsTo(view_pv, {
  foreignKey: 'eco',
  targetKey: 'eco',
});
  
view_pv.hasOne(pv_estados, {
  foreignKey: 'eco',
  sourceKey: 'eco'
});
  

