import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { Cat_Periodos } from "../interfaces/Catalogo_periodos.js";




export const Catalogo_peridos = SUGO_sequelize_connection.define<any, Cat_Periodos>(
    'periodo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
       fecha_inicio: {
        type:DataTypes.DATEONLY,
          

        },
       fecha_fin:{ 
        type: DataTypes.DATEONLY,
    
        },
        serial:{

        type: DataTypes.INTEGER,
            
        },
    },
    {
        timestamps: true,
      }

);
