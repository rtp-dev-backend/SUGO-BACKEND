import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"

export interface View_Trabajador {
    cred:               number
    nombre:             string
    curp:               string
    no_afiliacion:      string
    rfc:                string
    mod_clave:          number
    mod_desc:           string
    tipo_trab_descripcion:  string
    puesto_descripcion:     string
    adscripcion:        string
    trab_status:        number
    trab_status_desc:   string
    trab_sex_cve:       number
    trab_sex_desc:      string
    trab_foto:          string
    tipo_trab_clave:    number
    trab_fec_ingreso:   Date|string
    trab_fec_reingreso: Date|string
    trab_si_antiguedad: number
    tipo_trab_div:      string
    tipo_trab_proc:     string
    puesto_clave:       number
    adsc_cve:           number
    direccion:          string
    gerencia:           string
    departamento:       string
}

export const  view_trabajador = SUGO_sequelize_connection.define<any,View_Trabajador>(
    'view_trabajador', 
    {
        cred: {
            type: DataTypes.INTEGER,
            field: 'trab_credencial',
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: { 
            type: DataTypes.STRING,
            field: 'nombre_completo'
        },
        curp: { 
            type: DataTypes.STRING,
            field: 'trab_curp'
        },
        no_afiliacion: { 
            type: DataTypes.STRING,
            field: 'trab_no_afiliacion'
        },
        rfc: { 
            type: DataTypes.STRING,
            field: 'trab_rfc'
        },
        mod_clave:          DataTypes.INTEGER,
        mod_desc:           DataTypes.STRING,
        tipo_trab_descripcion:  DataTypes.STRING,
        puesto_descripcion: DataTypes.STRING,
        adscripcion:        DataTypes.STRING,
        trab_status:        DataTypes.INTEGER,
        trab_status_desc:   DataTypes.STRING,
        trab_sex_cve:       DataTypes.INTEGER,
        trab_sex_desc:      DataTypes.STRING,
        trab_foto:          DataTypes.STRING,
        tipo_trab_clave:    DataTypes.INTEGER,
        trab_fec_ingreso:   DataTypes.DATEONLY,
        trab_fec_reingreso: DataTypes.DATEONLY,
        trab_si_antiguedad: DataTypes.INTEGER,
        tipo_trab_div:      DataTypes.STRING,
        tipo_trab_proc:     DataTypes.STRING,
        puesto_clave:       DataTypes.INTEGER,
        adsc_cve:           DataTypes.INTEGER,
        direccion:          DataTypes.STRING,
        gerencia:           DataTypes.STRING,
        departamento:       DataTypes.STRING
    },
    {
        freezeTableName: true,      // stop the auto-pluralization performed by Sequelize, it will infer the table name to be equal to the model name
        timestamps: false,          // Es igual a createdAt, updatedAt  por separado
    }
);