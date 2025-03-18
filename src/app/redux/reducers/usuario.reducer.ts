import { Usuario } from '@interfaces/usuario.interfece';
import { createReducer, on } from '@ngrx/store';
import {
  usuarioActionInit,
  usuarioActionClear,
} from '@redux/actions/usuario.actions';
import { getCookie } from 'typescript-cookie';

let usuarioData = getCookie('usuario');

let parsedState: any = {
  id: 0,
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
  is_active: false,
};

export const initialState: Usuario = usuarioData
  ? JSON.parse(usuarioData)
  : parsedState;

export const usuarioReducer = createReducer(
  initialState,
  on(usuarioActionInit, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  }),
  on(usuarioActionClear, (state) => {
    return {
      ...parsedState,
    };
  }),
  
);
