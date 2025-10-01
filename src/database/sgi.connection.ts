import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'


/*
 &  Doc: https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database
        option 3            */
export const SGI_sequelize_connection = new Sequelize(
    process.env.DB_SGI_DATABASE,     // db name   
    process.env.DB_SGI_USER,         // user 
    process.env.DB_SGI_PASSWORD,     // passwd
    {
        host: process.env.DB_SGI_HOST,
        port: Number(process.env.DB_SGI_PORT),
        dialect: 'postgres'
    }
)