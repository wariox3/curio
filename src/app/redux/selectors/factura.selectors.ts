import { Factura, FacturaReduxState } from '@interfaces/facturas.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Factura = createFeatureSelector<FacturaReduxState>('factura');

export const obtenerFacturas = createSelector(
  Factura,
  (Factura) => Factura.facturas
);

export const obtenerFacturaActiva = createSelector(
  Factura,
  (Factura) => Factura.facturaActiva
);

export const obtenerNombreFacturaActiva = createSelector(Factura, (state) => {
  let nombre = '';
  const facturaActiva = state.facturas.find(
    (_, index) => index === state.facturaActiva
  );
  nombre = facturaActiva.nombre;
  if (state.facturaActiva > 0 && nombre === 'Factura') {
    nombre += ` ${state.facturaActiva}`;
  }
  return nombre;
});

export const obtenerItemsFacturaActiva = createSelector(Factura, (state) => {
  const facturaActiva = state.facturas.find(
    (_, index) => index === state.facturaActiva
  );
  return facturaActiva.data.itemsAgregados;
});

export const obtenerItemCantidadFacturaActiva = (itemId: number) => createSelector(Factura, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  const items = facturaActiva.data.itemsAgregados.find((item) => item.id === itemId);
  return items ? items.cantidad : 0;
});
