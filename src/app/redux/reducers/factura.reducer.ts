import { FacturaReduxState } from '@interfaces/facturas.interface';
import { createReducer, on } from '@ngrx/store';
import {
  actualizarCantidadItemFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  agregarItemFacturaActiva,
  facturaAction,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  retirarItemDeFacturaActiva,
  seleccionarFacturaActiva,
  actualizarPrecioItemFacturaActiva,
  actualizarClienteFacturaActiva,
} from '@redux/actions/factura.actions';
import { facturaInit } from '@constantes/factura.const';

export const initialState: FacturaReduxState = {
  facturas: [facturaInit],
  facturaActiva: 0,
};

export const facturaReducer = createReducer(
  initialState,
  on(facturaAction, (state) => state),
  on(facturaNuevaAction, (state, { factura }) => ({
    ...state,
    facturas: [...state.facturas, factura],
  })),
  on(facturaActualizarNombreAction, (state, { index, nombre }) => ({
    ...state,
    facturas: state.facturas.map((factura, i) =>
      i === index ? { ...factura, nombre } : factura
    ),
  })),
  on(facturaEliminarAction, (state, { index }) => ({
    ...state,
    facturas: state.facturas.filter((_, i) => i !== index),
    facturaActiva: state.facturaActiva === index ? 0 : state.facturaActiva,
  })),
  on(seleccionarFacturaActiva, (state, { id }) => ({
    ...state,
    facturaActiva: id,
  })),
  on(agregarItemFacturaActiva, (state, { item }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: [...(factura.detalles || []), item], // Agrega el item a "detalles"
          }
        : factura
    ),
  })),
  on(retirarItemDeFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.filter(
              (detalle) => detalle.item !== itemId
            ),
          }
        : factura
    ),
  })),
  on(actualizarCantidadItemFacturaActiva, (state, { itemId, cantidad }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId ? { ...detalle, cantidad } : detalle
            ),
          }
        : factura
    ),
  })),
  on(actualizarPrecioItemFacturaActiva, (state, { itemId, precio }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId ? { ...detalle, precio } : detalle
            ),
          }
        : factura
    ),
  })),
  on(actualizarSubtotalItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? { ...detalle, subtotal: detalle.precio * detalle.cantidad }
                : detalle
            ),
          }
        : factura
    ),
  })),
  on(actualizarClienteFacturaActiva, (state, { contacto }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura, // Mantiene todas las propiedades existentes de la factura
            ...{
              contacto_id: contacto.id,
              contacto_nombre_corto: contacto.nombre_corto,
              contacto_numero_identificacion: contacto.numero_identificacion,
            },
          }
        : factura
    ),
  }))
);
