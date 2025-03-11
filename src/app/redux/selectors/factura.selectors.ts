import { DocumentoImpuestoFacturaRespuesta, FacturaReduxState } from '@interfaces/facturas.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Facturacion = createFeatureSelector<FacturaReduxState>('facturacion');

export const obtenerFacturas = (contenedor: number) => createSelector(
  Facturacion,
  (Facturacion) => Facturacion.facturas.filter((factura) => factura.contenedor === contenedor)

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
    return facturaActiva ? facturaActiva.contacto_id : 1;
  }
);

export const obtenerTotalFacturaActiva = createSelector(
  Facturacion,
  (state) => {
    const facturaActiva = state.facturas[state.facturaActiva];
    return facturaActiva ? facturaActiva.total : 0;
  }
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

    return facturaActiva.detalles.reduce((acc, detalle) => {
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
    }, {} as Record<string, { impuesto: string; total: number }>);
  }
);



