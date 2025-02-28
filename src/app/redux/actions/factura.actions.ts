import { Factura } from '@interfaces/facturas.interface';
import { createAction, props } from '@ngrx/store';

export const facturaAction = createAction(
  '[Factura] lista',
);


export const facturaNuevaAction = createAction(
  '[Factura] nueva',
  props<{ factura: Factura }>()
);

export const facturaActualizarNombreAction = createAction(
  '[Factura] Actualizar Nombre',
  props<{ index: number; nombre: string }>()
);


export const facturaEliminarAction = createAction(
  '[Factura] Eliminar',
  props<{ index: number }>()
);

export const seleccionarFacturaActiva = createAction(
  '[Factura] seleccionar tab Factura',
  props<{ id: number }>()
)

export const agregarItemFacturaActiva = createAction(
  '[Factura] agregar items a la factura activa',
  props<{ facturaId: number; item: any }>()
);

export const retirarItemDeFacturaActiva = createAction(
  '[Factura] retirar Item de Factura activa',
  props<{ itemId: number }>()
);
