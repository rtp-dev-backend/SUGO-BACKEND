export interface IOperadoresServicio {
  id: number;
  servicio_id: number;
  turno: number;
  operador: number;
  descansos: string[];
  created_at: Date;
  updated_at: Date;
}