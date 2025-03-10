import { Item } from "./item.interface"

export interface DocumentoFactura {
  id: number;
  nombre: string,
  numero: any;
  fecha: string;
  fecha_vence: string;
  fecha_hasta: any;
  impuesto_operado: number;
  contacto_id: number;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  descuento: number;
  base_impuesto: number;
  subtotal: number;
  afectado: number;
  pendiente: number;
  impuesto: number;
  total: number;
  devengado: number;
  deduccion: number;
  base_cotizacion: number;
  base_prestacion: number;
  salario: number;
  estado_aprobado: boolean;
  documento_tipo_id: number;
  metodo_pago: number;
  metodo_pago_id: number;
  metodo_pago_nombre: string;
  forma_pago_id: number;
  forma_pago_nombre: string;
  estado_anulado: boolean;
  comentario: any;
  estado_electronico: boolean;
  estado_electronico_enviado: boolean;
  estado_electronico_notificado: boolean;
  soporte: any;
  orden_compra: any;
  plazo_pago: number;
  plazo_pago_id: number;
  plazo_pago_nombre: string;
  documento_referencia_id: any;
  documento_referencia_numero: string;
  cue: any;
  electronico_id: any;
  asesor: any;
  asesor_nombre_corto: any;
  sede: any;
  sede_nombre: any;
  programacion_detalle_id: any;
  contrato_id: any;
  detalles: DocumentoFacturaDetalleRespuesta[];
  pagos: PagoRespuestaFormulario[];
  referencia_cue: string | null;
  referencia_numero: number;
  referencia_prefijo: string | null;
  grupo_contabilidad_id: number;
  almacen_id: number;
  almacen_nombre: string;
}


export interface DocumentoFacturaDetalleRespuesta {
  id: number;
  documento_id: number;
  item: number;
  item_nombre: string;
  cuenta: any;
  cuenta_codigo: string;
  cuenta_nombre: string;
  cantidad: number;
  precio: number;
  pago: number;
  pago_operado: number;
  porcentaje: number;
  porcentaje_descuento: number;
  descuento: number;
  subtotal: number;
  total_bruto: number;
  base_impuesto: number;
  base: number;
  impuesto: number;
  impuesto_operado: number;
  impuesto_retencion: number;
  total: number;
  hora: number;
  dias: number;
  devengado: number;
  deducion: number;
  operacion: number;
  base_cotizacion: number;
  base_prestacion: number;
  documento_afectado_id: any;
  documento_afectado_numero: string;
  documento_afectado_contacto_nombre_corto: string;
  contacto_id: any;
  contacto_nombre_corto: string;
  naturaleza: any;
  detalle: any;
  numero: any;
  concepto_id: any;
  concepto_nombre: string;
  tipo_registro: string;
  credito_id: any;
  grupo_id: number;
  grupo_nombre: string;
  almacen_id: number;
  almacen_nombre: string;
  impuestos: DocumentoImpuestoFacturaRespuesta[];
}


export interface PagoRespuestaFormulario {
  id: number | null;
  documento_id: number;
  pago: number;
  cuenta_banco_id: number;
  cuenta_banco_nombre: string;
}

export interface FacturaReduxState {
  facturaActiva: number
  facturas: DocumentoFactura[]
}

export interface DocumentoImpuestoFacturaRespuesta {
  id: number;
  impuesto: number;
  nombre: string;
  nombre_extendido: string;
  porcentaje: number;
  base: number;
  operacion: number;
  impuesto_operacion: number;
  porcentaje_base: number;
  venta: boolean;
  compra: boolean;
  total: number;
  total_operado: number;
}
