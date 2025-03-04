import { FacturaReduxState } from '@interfaces/facturas.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Facturacion = createFeatureSelector<FacturaReduxState>('facturacion');

export const obtenerFacturas = createSelector(
  Facturacion,
  (Facturacion) => Facturacion.facturas
);

export const obtenerFacturaActiva = createSelector(
  Facturacion,
  (Facturacion) => Facturacion.facturaActiva
);

export const obtenerNombreFacturaActiva = createSelector(Facturacion, (state) => {
  let nombre = '';
  const facturaActiva = state.facturas.find(
    (_, index) => index === state.facturaActiva
  );
  nombre = facturaActiva.nombre;
  if (state.facturaActiva > 0 && nombre === 'Facturacion') {
    nombre += ` ${state.facturaActiva}`;
  }
  return nombre;
});

export const obtenerItemsFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas.find(
    (_, index) => index === state.facturaActiva
  );
  return facturaActiva.detalles;
});

export const obtenerItemCantidadFacturaActiva = (itemId: number) => createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  // const items = facturaActiva.data.itemsAgregados.find((item) => item.id === itemId);
  // return items !== undefined ? items.cantidad : 0;
});

export const obtenerClienteFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  // return facturaActiva ? facturaActiva.cliente : null;
});

// Selector para obtener el nombre del cliente de la factura activa
export const obtenerNombreClienteFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  // return facturaActiva ? facturaActiva.cliente_nombre : '';
});
