import { Request, Response } from "express";
import { saveImg } from '../../Cargar_Archivos/models/save.models'
import ds from 'fs/promises'
import fs from 'fs'
import path from 'path'
import subirArchivo from "../../utilities/saveFileInServer";

const MESES = ['ENERO', 'FEBRERO', 'MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

const pathInicial = '../../../../SUGO_backTS_files/'
const carpetaRoles = 'Roles_modulos'

export const getSavedFiles = async (req: Request, res: Response) => {
    try {
        const save = await saveImg.findAll()
        res.json(save)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
export const getSavedFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const save = await saveImg.findOne({
            where: { id },
        })
        res.json(save);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getDescargaArchivo = async (req: Request, res: Response) => {

    try {
        const consulta = await saveImg.findByPk(req.params.id)

        const archivoGuardado = path.join(__dirname,pathInicial, carpetaRoles, 'SEPTIEMBRE', consulta.dataValues.nombre);
        console.log(consulta.dataValues.nombre)
        if (fs.existsSync(archivoGuardado)) {
            return res.download(archivoGuardado);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const postSave = async (req: Request, res: Response) => {

    const { estatus = 0, periodo_id } = req.body

    let carpetaMes = 'sin_mes';

    const periodo: any = null      // buscar periodo ById(periodo_id)
    if(periodo){
        const { serial, fecha_ini } = periodo
        const mes = MESES[serial]
        const date = new Date(fecha_ini)
        carpetaMes = `${mes}_${date.getFullYear()}`
        
    }

    console.log({ estatus, carpeta: carpetaMes })
    try {

        const nombre = req.files.archivo.name;
        const time = new Date().getTime();
        const extensionIndex = nombre.lastIndexOf('.');
        const nombreSinExtension = nombre.substring(0, extensionIndex);
        const extension = nombre.substring(extensionIndex + 1);
        const nombreArchivos = nombreSinExtension + "_" + time + `.${extension}`;
        await subirArchivo(req.files, nombreArchivos, carpetaRoles, carpetaMes);
        const nuevoRegistro = await saveImg.create({
            estatus,
            nombre: nombreArchivos,
        });
        // console.log(carpetaMes)

        res.json(nuevoRegistro)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const deleteSave = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleteRegistro = await saveImg.findOne({
            where: {
                id,
            },
        });
        if (!deleteRegistro) {
            return res.status(404).json({ message: `No existe registro con el ID: ${id} `  });
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

}