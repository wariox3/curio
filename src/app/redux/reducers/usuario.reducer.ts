import { createReducer, on } from '@ngrx/store';
import { usuarioActionInit } from '@redux/actions/usuario.actions';

// import { getCookie } from 'typescript-cookie';
// import { Usuario } from '@interfaces/usuario/usuario';

//let usuarioData = getCookie('usuario');

let parsedState: any = {
  id: '',
  username: '',
  imagen: '',
  nombre_corto: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  idioma: '',
  dominio: '',
  fecha_limite_pago: new Date(),
  vr_saldo: 0,
  fecha_creacion: new Date(),
  verificado: false,
  es_socio: false,
  socio_id: '',
  is_active: false
};

// export const initialState: Usuario = usuarioData
//   ? JSON.parse(usuarioData)
//   : parsedState;

export const usuarioReducer = createReducer(
  parsedState,
  on(usuarioActionInit, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  }),
);
