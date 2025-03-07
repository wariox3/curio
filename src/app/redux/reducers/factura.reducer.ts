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
  retirarDetallesFacturaActiva,
  actualizarSubtotalFacturaActiva,
  actualizarTotalFacturaActiva,
  actualizarMetodoPagoFacturaActiva,
  actualizarPlazoPagoFacturaActiva,
  actualizarTotalItemFacturaActiva,
  actualizarImpuestosItemFacturaActiva,
  actualizarImpuestoOperadoFacturaActiva,
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
  on(actualizarImpuestosItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? {
                    ...detalle,
                    impuesto:
                      detalle.subtotal *
                      (detalle.impuestos[0].porcentaje / 100),
                    impuesto_operado:
                      detalle.subtotal *
                      (detalle.impuestos[0].porcentaje / 100) *
                      detalle.impuestos[0].impuesto_operacion,
                  }
                : detalle
            ),
          }
        : factura
    ),
  })),
  on(actualizarTotalItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? {
                    ...detalle,
                    total: detalle.subtotal + detalle.impuesto,
                    neto: detalle.subtotal + detalle.impuesto,
                  }
                : detalle
            ),
          }
        : factura
    ),
  })),
  on(actualizarSubtotalFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            subtotal: factura.detalles.reduce(
              (total, detalle) => total + (detalle.subtotal || 0),
              0
            ),
          }
        : factura
    ),
  })),
  on(actualizarTotalFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            total: factura.detalles.reduce(
              (total, detalle) => total + (detalle.total || 0),
              0
            ),
          }
        : factura
    ),
  })),
  on(actualizarImpuestoOperadoFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            impuesto_operado: factura.detalles.reduce(
              (impuesto_operado, detalle) => impuesto_operado + (detalle.impuesto_operado || 0),
              0
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
            ...factura,
            ...{
              contacto_id: contacto.id,
              contacto_nombre_corto: contacto.nombre_corto,
              contacto_numero_identificacion: contacto.numero_identificacion,
            },
          }
        : factura
    ),
  })),
  on(retirarDetallesFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            detalles: [], // Reinicia el array de detalles
          }
        : factura
    ),
  })),
  on(actualizarMetodoPagoFacturaActiva, (state, { metodo_pago_id }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? { ...factura, metodo_pago: metodo_pago_id }
        : factura
    ),
  })),
  on(actualizarPlazoPagoFacturaActiva, (state, { plazo_pago_id }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? { ...factura, plazo_pago: plazo_pago_id }
        : factura
    ),
  }))
);
