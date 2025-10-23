export interface IRutas {
  id: number;
  ruta: string;
  modulo: number;
  origen: string;
  origen_nomenclatura?: string;
  destino?: string;
  destino_nomenclatura?: string;
  estatus: number;
  created_at: Date;
  updated_at: Date;
}
