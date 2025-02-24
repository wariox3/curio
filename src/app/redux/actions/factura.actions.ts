import { createAction, props } from '@ngrx/store';

export const facturaAction = createAction(
  '[Factura] nueva',
  props<{ usuario: any }>()
);
