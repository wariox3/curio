import { contenedorInit } from '@constantes/contenedor.const';
import { createReducer, on } from '@ngrx/store';
import { ContenedorActionBorrarInformacion, ContenedorActionInit, ContenedorSeleccionAction } from '@redux/actions/contenedor.actions';

export const contenedorReducer = createReducer(
  contenedorInit,
  on(ContenedorActionInit, (state, { contenedor }) => {
    return {
      ...state,
      ...contenedor,
    };
  }),
  on(ContenedorSeleccionAction, (state, { seleccion }) => {
    return {
      ...state,
      seleccion: seleccion,
    };
  }),
  on(ContenedorActionBorrarInformacion, (state) => {
    return {
      ...state,
      ...contenedorInit,
    };
  })
);
