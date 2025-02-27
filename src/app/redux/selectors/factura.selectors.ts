
import { Factura, FacturaReduxState } from "@interfaces/facturas";
import { createFeatureSelector, createSelector } from "@ngrx/store";

const Factura = createFeatureSelector<FacturaReduxState>('factura');


export const obtenerFacturas = createSelector(
  Factura,
  (Factura) => Factura.facturas
);


export const obtenerFacturaActiva = createSelector(
  Factura,
  (Factura) => Factura.facturaActiva
);
