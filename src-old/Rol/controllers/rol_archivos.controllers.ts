import { Request, Response } from "express";
import ds from 'fs/promises'
import fs from 'fs'
import path from 'path'
import subirArchivo from "../../utilities/saveFileInServer";
import { rol_archivos } from './../models/rol_archivos.models';
import {Rol_Header} from '../../Rol/models/Rol_headers.model'
// import {rol_headers_files} from './../models/rol_archivos.models'

const pathInicial = '../../../../Back_Sugo_TS_files/'
const carpetaRoles = 'Roles_modulos'

export const getArchivofiles = async (req: Request, res: Response) => {
    try {
        const archivo = await rol_archivos.findAll()
        res.json(archivo)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
export const getArchivosfileOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const archivo = await rol_archivos.findOne({
            where: { id },
        })
        res.json(archivo);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getDescargaArchivofile = async (req: Request, res: Response) => {

    try {
        const consulta = await rol_archivos.findByPk(req.params.id)

        const archivoGuardado = path.join(__dirname,pathInicial, carpetaRoles, 'SEPTIEMBRE', consulta.dataValues.nombre);
        if (fs.existsSync(archivoGuardado)) {
            return res.download(archivoGuardado);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const postSaveArchivoFile = async (req: Request, res: Response) => {

    const { usuario,mes } = req.body 
    const { archivo } = req.files
  
    const carpeta = mes ? mes : 'aplicacion';


    try {
        const nombre = archivo.name;
        const time = new Date().getTime();
        const extensionIndex = nombre.lastIndexOf('.');
        const nombreSinExtension = nombre.substring(0, extensionIndex);
        const extension = nombre.substring(extensionIndex + 1);
        const nombreArchivos = nombreSinExtension + "_" + time + `.${extension}`;
        await subirArchivo(archivo, nombreArchivos, carpetaRoles, carpeta);
        const nuevoRegistro = await rol_archivos.create({
            nombre: nombreArchivos,
            usuario:usuario
        });
        

        res.json(nuevoRegistro)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const deleteArchivo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleteRegistro = await rol_archivos.findOne({
            where: {
                id,
            },
        });
        if (!deleteRegistro) {
            return res.status(404).json({ error: `No existe registro con el ID: ${id} `  });
        }
        await deleteRegistro.destroy();

        const filePath = path.join(__dirname, pathInicial, carpetaRoles, 'SEPTIEMBRE', deleteRegistro.nombre);
        
        try {
            await ds.unlink(filePath); // Eliminar el archivo
        } catch (err) {
            console.error(`Error al eliminar el archivo: ${err.message}`);
        }
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

};

// export const PostRol_headers_files = async (req:Request, res:Request){
// const {id_header} = req.params;
// const { usuario,mes} = req.body
// const ActualizarRol_header = await rol_archivos.create(
//     usuario
// )




// };

