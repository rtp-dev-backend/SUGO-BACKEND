export interface IHorarios {
  id: number;
  servicio_id: number;
  dias_servicios: string;
  turno: number;
  hora_inicio: string;
  hora_inicio_cc: string;
  lugar_inicio: string;
  hora_termino: string;
  hora_termino_cc: string;
  termino_modulo: string;
  lugar_termino_cc: string;
  created_at: Date;
  updated_at: Date;
}