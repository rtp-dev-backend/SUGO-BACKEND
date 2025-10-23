export interface IRoles {
  id: number;
  archivo: number | null;
  periodo: number | null;
  ruta: string | null;
  modulo: number | null;
  notas: string | null;
  dias_impar: string | null;
  dias_par: string | null;
  created_at: Date;
  updated_at: Date;
}