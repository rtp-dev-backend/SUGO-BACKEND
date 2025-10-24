import { Request, Response } from "express";
import { pv_estados } from "../Models/pv_estados.model";
import { Op } from "sequelize";

// Consulta registros de caseta por rango de fechas, eco y operador
export async function getCasetaRegistros(req: Request, res: Response) {
	try {
		const { fecha_inicio, fecha_fin, eco, op_cred, tipo } = req.body;
		if (!fecha_inicio || !fecha_fin || !eco || !op_cred || !tipo) {
			return res.status(400).json({ error: "Faltan parámetros" });
		}

		const registros = await pv_estados.findAll({
			where: {
				op_cred,
				tipo,
				eco,
				momento: {
					[Op.between]: [fecha_inicio, fecha_fin]
				}
			}
		});
		return res.json(registros);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Error al consultar registros de caseta" });
	}
}
