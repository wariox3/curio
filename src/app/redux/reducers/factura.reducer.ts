import { FacturaReduxState } from '@interfaces/facturas.interface';
import { createReducer, on } from '@ngrx/store';
import {
  facturaAction,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  seleccionarFacturaActiva
} from '@redux/actions/factura.actions';

export const initialState: FacturaReduxState = {
  facturas: [
    {
      id: 0,
      nombre: 'Factura principal',
      data: {},
    },
  ],
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
    facturaActiva: state.facturaActiva === index ? null : state.facturaActiva,
  })),
  on(seleccionarFacturaActiva, (state, { id }) => ({
    ...state,
    facturaActiva: id,
  })),
);
