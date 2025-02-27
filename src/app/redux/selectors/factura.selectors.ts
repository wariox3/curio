
import { Factura } from "@interfaces/facturas";
import { createFeatureSelector, createSelector } from "@ngrx/store";

const Factura = createFeatureSelector<Factura[]>('factura');


export const obtenerFacturas = createSelector(
  Factura,
  (Factura) => Factura
);
