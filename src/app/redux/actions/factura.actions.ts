import { Contacto } from '@interfaces/contacto';
import { DocumentoFactura, DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { createAction, props } from '@ngrx/store';

export const facturaAction = createAction('[Factura] lista');

export const facturaNuevaAction = createAction(
  '[Factura] nueva',
  props<{ factura: DocumentoFactura }>()
);

export const facturaActualizarNombreAction = createAction(
  '[Factura] Actualizar Nombre',
  props<{ index: string; nombre: string }>()
);

export const facturaEliminarAction = createAction(
  '[Factura] Eliminar',
  props<{ index: string }>()
);

export const seleccionarFacturaActiva = createAction(
  '[Factura] seleccionar tab Factura',
  props<{ id: string }>()
);

export const agregarItemFacturaActiva = createAction(
  '[Factura] agregar items a la factura activa',
  props<{ item: DocumentoFacturaDetalleRespuesta }>()
);

export const retirarItemDeFacturaActiva = createAction(
  '[Factura] retirar Item de Factura activa',
  props<{ itemId: number }>()
);

export const actualizarCantidadItemFacturaActiva = createAction(
  '[Factura] Actualizar Cantidad del Item de una factura activa',
  props<{ itemId: number; cantidad: number }>()
);


export const actualizarPrecioItemFacturaActiva = createAction(
  '[Factura] Actualizar Precio del Item de una factura activa',
  props<{ itemId: number; precio: number }>()
);

export const actualizarSubtotalItemFacturaActiva = createAction(
  '[Factura] Actualizar Subtotal del Item de una factura activa',
  props<{ itemId: number; }>()
);

export const actualizarImpuestosItemFacturaActiva = createAction(
  '[Factura] Actualizar valor impuesto del Item de una factura activa',
  props<{ itemId: number; }>()
)

export const actualizarTotalItemFacturaActiva = createAction(
  '[Factura] Actualizar Total del Item de una factura activa',
  props<{ itemId: number; }>()
);


export const actualizarClienteFacturaActiva = createAction(
  '[Factura] Actualizar Cliente de Factura Activa',
  props<{ contacto: Contacto }>()
);

export const actualizarImpuestoOperadoFacturaActiva = createAction(
  '[Factura] actualizar impuesto operado factura activa',
);

export const actualizarImpuestoFacturaActiva = createAction(
  '[Factura] actualizar impuesto factura activa',
);

export const retirarDetallesFacturaActiva = createAction(
  '[Factura] Retirar Detalles de Factura Activa',
);

export const actualizarSubtotalFacturaActiva = createAction(
  '[Factura] Calcular el subtotal de Factura Activa',
);

export const actualizarTotalFacturaActiva = createAction(
  '[Factura] Calcular el total de Factura Activa',
);

export const actualizarMetodoPagoFacturaActiva = createAction(
  '[Factura] Actualizar Método de Pago de Factura Activa',
  props<{ metodo_pago_id: number }>()
);

export const actualizarPlazoPagoFacturaActiva = createAction(
  '[Factura] Actualizar Plazo de Pago de Factura Activa',
  props<{ plazo_pago_id: number }>()
);

export const actualizarTotalesImpuestosItemFacturaActiva = createAction(
  '[Factura] Actualizar Totales de Impuestos de Item de Factura Activa',
  props<{ itemId: number }>()
);

export const actualizarBaseImpuestoItemFacturaActiva = createAction(
  '[Factura] Actualizar Base del Impuesto de Item de Factura Activa',
  props<{ itemId: number }>()
);

export const actualizarTotalBrutoItemFacturaActiva = createAction(
  '[Factura] Actualizar Total Bruto de Item de Factura Activa',
  props<{ itemId: number }>()
);

export const actualizarBaseImpuestoFacturaActiva = createAction(
  '[Factura] Actualizar Base del Impuesto Acumulada de Factura Activa'
);

export const actualizarTotalBrutoFacturaActiva = createAction(
  '[Factura] Actualizar Total Bruto Acumulado de Factura Activa'
);

export const actualizaImpuestoFacturaActiva = createAction(
  '[Factura] Actualizar Total Bruto Acumulado de Factura Activa'
);

export const actualizarAsesorFactura = createAction(
  '[Factura] Actualizar Asesor',
  props<{ asesor: number }>()
);

export const actualizarAlmacenFacturaPorContenedor = createAction(
  '[Factura] Actualizar Alamacen facturas por contendor',
  props<{ almacen: number, contendorId: number }>()
);
