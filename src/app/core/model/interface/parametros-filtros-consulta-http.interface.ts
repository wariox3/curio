import { Modelos } from '../types/modelos.type';
import { Serializador } from '../types/serializador.type';
import { Filtros } from './filtros.interface';


export interface ParametrosFiltrosConsultasHttp {
  limite: number;
  desplazar: number;
  ordenamientos: string[];
  limite_conteo: number;
  modelo: Modelos;
  serializador?: Serializador;
  filtros: Filtros[];
  documento_clase_id?: number;
}
