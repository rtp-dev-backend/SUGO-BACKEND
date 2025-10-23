import { Request, Response } from "express";
import { Roles } from "../models/roles.model";
import { guardarRolCompletoService } from '../services/guardarRolCompleto.service';


// Controlador para cargar un rol completo desde un archivo Excel
export const cargarRolCompleto = async (req: Request, res: Response) => {
    const transaction = await Roles.sequelize?.transaction();
    try {
        const { nombre_archivo, subido_por, hojas, periodo, modulo } = req.body;
        await guardarRolCompletoService({ nombre_archivo, subido_por, hojas, periodo, modulo }, transaction);
        await transaction?.commit();
        res.status(201).json({
            message: "Archivo, roles y datos asociados guardados correctamente",
        });
    } catch (error) {
        await transaction?.rollback();
        // Si el error es un arreglo de errores de validación, respóndelo directamente
        if (Array.isArray(error)) {
            res.status(400).json({
                message: "Errores de validación en el archivo",
                errores: error
            });
        } else {
            res.status(400).json({ message: error.message || "Error al guardar el archivo completo", error });
        }
    }
};

