export interface IJornadasExcepcionales {
  id: number;
  rol_id: number;
  operador: number | null;
  lugar: string | null;
  hora_inicio: string | null;
  hora_termino: string | null;
  dias_servicio: any; // JSON
  created_at: Date;
  updated_at: Date;
}