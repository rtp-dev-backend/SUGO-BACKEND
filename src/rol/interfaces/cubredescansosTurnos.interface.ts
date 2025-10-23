export interface ICubredescansosTurnos {
  id: number;
  cubredescanso_id: number;
  turno: number;
  operador: number | null;
  servicios_a_cubrir: any; // JSON
  created_at: Date;
  updated_at: Date;
}