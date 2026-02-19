export interface PvEstados {
  id: number;
  momento: string;
  tipo: number;
  eco: number;
  eco_tipo: number;
  motivo_id: number;
  motivo_Desc: string;
  modulo: number;
  direccion: string;
  ruta: string;
  ruta_modalidad: string;
  ruta_cc: string;
  op_cred: number;
  op_turno: number;
  extintor: number;
  estatus: number;
  createAt: string;
  createBy: number;
  createBy_modulo: number;
  updateAt: string;
  updateBy: number;
  prev_values: string;
  registro_id: number;
  modulo_puerta: string;
  hora_entrada_operador: string;
}
