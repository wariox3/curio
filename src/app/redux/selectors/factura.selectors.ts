
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

export const obtenerNombreFacturaActiva = createSelector(
  Factura,
  (state) => {
    let nombre = ''
    const facturaActiva = state.facturas.find((_, index) => index === state.facturaActiva);
    nombre = facturaActiva.nombre
    console.log(nombre);

    if(state.facturaActiva > 0 && nombre === 'Factura'){
      nombre += ` ${state.facturaActiva}`
    }
    return nombre;
  }
);
