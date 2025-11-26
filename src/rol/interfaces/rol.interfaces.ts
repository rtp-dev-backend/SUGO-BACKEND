export interface ICargasArchivosRol {
  id: number;
  nombre_archivo?: string;
  subido_por?: number;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface IRoles {
  id: number;
  archivo: number;
  periodo: number;
  ruta_modalidad: number;
  modulo: number;
  notas: string;
  created_at: Date;
  updated_at: Date;
  dias_impar?: string;
  dias_par?: string;
  estado: boolean;
}

export interface IServicios {
  id: number;
  rol_id: number;
  economico: number;
  sistema: string;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface IOperadoresServicio {
  id: number;
  servicio_id: number;
  turno: number;
  operador: number;
  descansos: string[];
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface IHorarios {
  id: number;
  servicio_id: number;
  servicio_operador_id: number;
  dias_servicios: string;
  turno: number;
  hora_inicio_turno?: string;
  hora_inicio_cc?: string;
  lugar_inicio?: string;
  hora_termino_turno?: string;
  hora_termino_cc?: string;
  lugar_termino_cc?: string;
  termino_modulo?: string;
  termino_turno?: string;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface ICubredescansos {
  id: number;
  rol_id: number;
  economico?: number;
  sistema: string;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface ICubredescansosTurnos {
  id: number;
  cubredescanso_id: number;
  turno: number;
  operador?: number;
  servicios_a_cubrir?: any;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface IJornadasExcepcionales {
  id: number;
  rol_id: number;
  operador: number;
  lugar?: string;
  hora_inicio?: string;
  hora_termino?: string;
  dias_servicio?: any;
  created_at: Date;
  updated_at: Date;
  estado: boolean;
}

export interface IPeriodosRol {
  id: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  periodo?: number;
}

export interface IBitacora {
  id: number;
  tabla: string;
  accion: string;
  usuario?: string;
  updated_at: Date;
  datos_old?: any;
  datos_new?: any;
  metadata?: any;
}
