import { Factura } from '@interfaces/facturas';
import { createReducer, on } from '@ngrx/store';
import {
  facturaAction,
  facturaNuevaAction,
  facturaActualizarNombreAction,
  facturaEliminarAction,
} from '@redux/actions/factura.actions';

// import { getCookie } from 'typescript-cookie';
// import { Usuario } from '@interfaces/usuario/usuario';

//let usuarioData = getCookie('usuario');

let parsedState: Factura[] = [
  {
    id: 0,
    nombre: 'Factura principal',
    data: {},
  },
];

// export const initialState: Usuario = usuarioData
//   ? JSON.parse(usuarioData)
//   : parsedState;

export const facturaReducer = createReducer(
  parsedState,
  on(facturaAction, (state) => {
    return state;
  }),
  on(facturaNuevaAction, (state, { factura }) => {
    return [...state, factura];
  }),
  on(facturaActualizarNombreAction, (state, { index, nombre }) => {
    return state.map((factura, i) =>
      i === index ? { ...factura, nombre } : factura
    );
  }),
  on(facturaEliminarAction, (state, { index }) => {
    return state.filter((_, i) => i !== index);
  })
);
