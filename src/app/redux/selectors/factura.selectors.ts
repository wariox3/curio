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

export const obtenerNombreFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    let nombre = '';
    const facturaActiva = state.facturas.find(
      (_, index) => index === state.facturaActiva
    );
    nombre = facturaActiva.nombre;
    if (state.facturaActiva > 0 && nombre === 'Facturacion') {
      nombre += ` ${state.facturaActiva}`;
    }
    return nombre;
  }
);

export const obtenerItemsFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas.find(
      (_, index) => index === state.facturaActiva
    );
    return facturaActiva.detalles;
  }
);

export const obtenerItemCantidadFacturaActiva = (itemId: number) =>
  createSelector(Facturacion, (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    if (!facturaActiva || !facturaActiva.detalles) {
      return 0; // Si no hay factura activa o no tiene detalles, devuelve 0
    }

    const detalle = facturaActiva.detalles.find(
      (detalle) => detalle.item === itemId
    );
    return detalle ? detalle.cantidad : 0; // Si no encuentra el item, devuelve 0
  });

export const obtenerClienteFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    return facturaActiva ? facturaActiva.contacto_id : null;
  }
);

// Selector para obtener el nombre del cliente de la factura activa
export const obtenerNombreClienteFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    // return facturaActiva ? facturaActiva.cliente_nombre : '';
  }
);

// Selector para obtener la factura activa
export const obtenerDataFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  return facturaActiva ? facturaActiva : null;
});
