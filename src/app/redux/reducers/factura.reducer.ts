import { createReducer, on } from '@ngrx/store';
import { facturaAction } from '@redux/actions/factura.actions';

// import { getCookie } from 'typescript-cookie';
// import { Usuario } from '@interfaces/usuario/usuario';

//let usuarioData = getCookie('usuario');

let parsedState: any = {
  id: 0,
};

// export const initialState: Usuario = usuarioData
//   ? JSON.parse(usuarioData)
//   : parsedState;

export const usuarioReducer = createReducer(
  parsedState,
  on(facturaAction, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  }),
);
