import { DocumentoImpuestoFacturaRespuesta } from "@interfaces/facturas.interface";

export interface Item {

  readonly id: number;
  readonly impuesto: number;
  impuestos: DocumentoImpuestoFacturaRespuesta[];
  nombre: string;
  codigo: string | null;
  referencia: string | null;
  costo: number;
  precio: number;
  base: number;
  porcentaje: number;
  total: number;
  nombre_extendido: string;
  porcentaje_total: number;
  venta: boolean;
  compra: boolean;
  producto: boolean;
  servicio: boolean;
  inventario: boolean;
  existencia: number;
  disponible: number;
  cantidad: number,
  subtotal: number,
  favorito: boolean,
  imagen: string,
}

export interface ItemSeleccionar {
  id: number;
  nombre: string;
}
