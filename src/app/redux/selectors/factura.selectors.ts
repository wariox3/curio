import {
  DocumentoImpuestoFacturaRespuesta,
  FacturaReduxState,
} from '@interfaces/facturas.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Facturacion = createFeatureSelector<FacturaReduxState>('facturacion');

export const obtenerFacturas = (contenedor: number) =>
  createSelector(Facturacion, (Facturacion) =>
    Facturacion.facturas.filter((factura) => factura.contenedor === contenedor),
  );

export const obtenerDetalleItemFacturaPorContenedor = (
  contenedorId: number,
  itemId: number,
) =>
  createSelector(Facturacion, (state) => {
    // Filtrar facturas por contenedorId
    const facturas = state.facturas.filter(
      (factura) => factura.contenedor === contenedorId,
    );

    // Obtener la factura activa
    const facturaActiva = state.facturas[state.facturaActiva];

    // Si no hay factura activa o detalles, devolver null
    if (!facturaActiva || !facturaActiva.detalles) {
      return null;
    }

    // Buscar el item en los detalles
    const itemEncontrado = facturaActiva.detalles.find(
      (detalle) => detalle.item === itemId,
    );

    return itemEncontrado || null; // Devolver el item si existe, de lo contrario, null
  });

export const obtenerFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas.find(
    (factura) => factura.uuid === state.facturaActiva,
  );
  return facturaActiva;
});

export const obtenerFacturaFacturaActiva = createSelector(
  Facturacion,
  (Facturacion) => Facturacion.facturaActiva,
);

export const obtenerNombreFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    let nombre = '';
    const facturaActiva = state.facturas.find(
      (factura) => factura.uuid === state.facturaActiva,
    );
    nombre = facturaActiva.nombre;
    if (state.facturaActiva > '' && nombre === 'Facturacion') {
      nombre += ` ${state.facturaActiva}`;
    }
    return nombre;
  },
);

export const obtenerItemsFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas.find(
      (factura) => factura.uuid === state.facturaActiva,
    );
    return facturaActiva.detalles;
  },
);

export const obtenerItemCantidadFacturaActiva = (itemId: number) =>
  createSelector(obtenerFacturaActiva, (facturaActiva) => {
    if (!facturaActiva || !facturaActiva.detalles) {
      return 0;
    }
    const detalle = facturaActiva.detalles.find(
      (detalle) => detalle.item === itemId,
    );
    return detalle ? detalle.cantidad : 0;
  });

export const obtenerClienteFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    return facturaActiva ? facturaActiva.contacto_id : 1;
  },
);

export const obtenerTotalFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    return facturaActiva ? facturaActiva.total : 0;
  },
);

export const obtenerDataFacturaActiva = createSelector(Facturacion, (state) => {
  const facturaActiva = state.facturas[state.facturaActiva];
  return facturaActiva ? facturaActiva : null;
});

export const obtenerImpuestosFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    if (!facturaActiva || !facturaActiva.detalles) {
      return {};
    }

    return facturaActiva.detalles.reduce(
      (acc, detalle) => {
        if (!detalle.impuestos?.length) {
          return acc; // Ignorar si no hay impuestos
        }

        const subtotal = detalle.subtotal || 0;

        detalle.impuestos.forEach((impuesto) => {
          if (!impuesto?.nombre_extendido) {
            return; // Ignorar impuestos sin nombre
          }

          const clave = impuesto.nombre_extendido;
          const porcentaje = impuesto.porcentaje || 0;
          const porcentajeBase = impuesto.porcentaje_base || 100;

          if (!acc[clave]) {
            acc[clave] = {
              impuesto: clave,
              total: 0,
            };
          }

          const impuestoCalculado = subtotal * (porcentaje / porcentajeBase);
          acc[clave].total += impuestoCalculado;
        });

        return acc;
      },
      {} as Record<string, { impuesto: string; total: number }>,
    );
  },
);
