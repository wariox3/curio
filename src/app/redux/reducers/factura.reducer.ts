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
  actualizarTotalesImpuestosItemFacturaActiva,
  actualizarBaseImpuestoItemFacturaActiva,
  actualizarBaseImpuestoFacturaActiva,
  actualizarTotalBrutoItemFacturaActiva,
  actualizarTotalBrutoFacturaActiva,
  actualizaImpuestoFacturaActiva,
  actualizarAsesorFactura,
  actualizarAlmacenFacturaPorContenedor,
} from '@redux/actions/factura.actions';

export const initialState: FacturaReduxState = {
  facturas: [],
  facturaActiva: '',
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
    facturas: state.facturas.map((factura) =>
      factura.uuid === index ? { ...factura, nombre } : factura,
    ),
  })),
  on(facturaEliminarAction, (state, { index }) => ({
    ...state,
    facturas: state.facturas.filter((factura) => factura.uuid !== index),
    facturaActiva: state.facturaActiva === index ? '' : state.facturaActiva,
  })),
  on(seleccionarFacturaActiva, (state, { id }) => ({
    ...state,
    facturaActiva: id,
  })),
  on(agregarItemFacturaActiva, (state, { item }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: [...(factura.detalles || []), item],
          }
        : factura,
    ),
  })),
  on(retirarItemDeFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.filter(
              (detalle) => detalle.item !== itemId,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarCantidadItemFacturaActiva, (state, { itemId, cantidad }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId ? { ...detalle, cantidad } : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarPrecioItemFacturaActiva, (state, { itemId, precio }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId ? { ...detalle, precio } : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarSubtotalItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? { ...detalle, subtotal: detalle.precio * detalle.cantidad }
                : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarImpuestosItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) => {
              const primerImpuesto = detalle.impuestos?.[0]; // Validar si existe el impuesto en la posición 0

              return detalle.item === itemId
                ? {
                    ...detalle,
                    impuesto:
                      (detalle.subtotal || 0) *
                      ((primerImpuesto?.porcentaje || 0) / 100),
                    impuesto_operado:
                      (detalle.subtotal || 0) *
                      ((primerImpuesto?.porcentaje || 0) / 100) *
                      (primerImpuesto?.impuesto_operacion || 0),
                  }
                : detalle;
            }),
          }
        : factura,
    ),
  })),

  on(actualizarTotalItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? {
                    ...detalle,
                    total: detalle.subtotal + detalle.impuesto,
                    neto: detalle.subtotal + detalle.impuesto,
                  }
                : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarSubtotalFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            subtotal: factura.detalles.reduce(
              (total, detalle) => total + (detalle.subtotal || 0),
              0,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarTotalFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            total: factura.detalles.reduce(
              (total, detalle) => total + (detalle.total || 0),
              0,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarImpuestoOperadoFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            impuesto_operado: factura.detalles.reduce(
              (impuesto_operado, detalle) =>
                impuesto_operado + (detalle.impuesto_operado || 0),
              0,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarClienteFacturaActiva, (state, { contacto }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            ...{
              contacto_id: contacto.id,
              contacto_nombre_corto: contacto.nombre_corto,
              contacto_numero_identificacion: contacto.numero_identificacion,
            },
          }
        : factura,
    ),
  })),
  on(retirarDetallesFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: [], // Reinicia el array de detalles
          }
        : factura,
    ),
  })),
  on(actualizarMetodoPagoFacturaActiva, (state, { metodo_pago_id }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? { ...factura, metodo_pago: metodo_pago_id }
        : factura,
    ),
  })),
  on(actualizarPlazoPagoFacturaActiva, (state, { plazo_pago_id }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? { ...factura, plazo_pago: plazo_pago_id }
        : factura,
    ),
  })),
  on(actualizarTotalesImpuestosItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? {
                    ...detalle,
                    impuestos: detalle.impuestos.map((impuesto) => ({
                      ...impuesto,
                      total:
                        (detalle.subtotal || 0) * (impuesto.porcentaje / 100),
                      total_operado:
                        (detalle.subtotal || 0) *
                        (impuesto.porcentaje / 100) *
                        (impuesto.impuesto_operacion || 1),
                      base: (detalle.subtotal * impuesto.porcentaje_base) / 100,
                    })),
                  }
                : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarBaseImpuestoItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) => {
              const primerImpuesto = detalle.impuestos?.[0]; // Obtener el primer impuesto si existe

              return detalle.item === itemId
                ? {
                    ...detalle,
                    base_impuesto: primerImpuesto
                      ? ((detalle.subtotal || 0) *
                          (primerImpuesto.porcentaje_base || 0)) /
                        100
                      : 0, // Si no hay impuestos, base_impuesto será 0
                  }
                : detalle;
            }),
          }
        : factura,
    ),
  })),
  on(actualizarBaseImpuestoFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            base_impuesto: factura.detalles.reduce(
              (baseImpuesto, detalle) => baseImpuesto + detalle.base_impuesto,
              0,
            ),
          }
        : factura,
    ),
  })),
  on(actualizaImpuestoFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            impuesto: factura.detalles.reduce(
              (impuesto, detalle) => impuesto + detalle.impuesto,
              0,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarTotalBrutoItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            detalles: factura.detalles.map((detalle) =>
              detalle.item === itemId
                ? {
                    ...detalle,
                    total_bruto:
                      (detalle.subtotal || 0) +
                      (detalle.impuestos?.reduce(
                        (sum, impuesto) => sum + (impuesto.total || 0),
                        0,
                      ) || 0),
                  }
                : detalle,
            ),
          }
        : factura,
    ),
  })),
  on(actualizarTotalBrutoFacturaActiva, (state) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva
        ? {
            ...factura,
            total_bruto: factura.detalles.reduce((total, detalle) => {
              return total + (detalle.total_bruto || 0);
            }, 0),
          }
        : factura,
    ),
  })),
  on(actualizarAsesorFactura, (state, { asesor }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.uuid === state.facturaActiva ? { ...factura, asesor } : factura
    ),
  })),
  on(actualizarAlmacenFacturaPorContenedor, (state, { almacen, contendorId }) => ({
    ...state,
    facturas: state.facturas.map((factura) =>
      factura.contenedor === contendorId ? { ...factura, almacen } : factura
    ),
  }))
);
