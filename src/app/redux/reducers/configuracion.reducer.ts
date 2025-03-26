import { ConfiguracionReduxState } from '@interfaces/configuracion.interface';
import { createReducer, on } from '@ngrx/store';
import {
  actualizarDocumentoTipoIdPorContenedor,
  actualizarDocumentoTipoNombrePorContenedor,
  configuracionActionClear,
  ConfiguracionActionInit,
} from '@redux/actions/configuracion.actions';

export const initialState: ConfiguracionReduxState = {
  documento_tipo_id: 0,
  documento_tipo_nombre: '',
  contenedor_id: 0,
  sede: 1,
};

export const configuracionReducer = createReducer(
  initialState,
  on(ConfiguracionActionInit, (state, { configuracion }) => {
    return {
      ...state,
      ...configuracion,
    };
  }),
  on(
    actualizarDocumentoTipoIdPorContenedor,
    (state, { contenedorId, documento_tipo_id }) => ({
      ...state,
      documento_tipo_id:
        state.contenedor_id === contenedorId
          ? documento_tipo_id
          : state.documento_tipo_id,
    }),
  ),
  on(
    actualizarDocumentoTipoNombrePorContenedor,
    (state, { contenedorId, documento_tipo_nombre }) => ({
      ...state,
      documento_tipo_nombre:
        state.contenedor_id === contenedorId
          ? documento_tipo_nombre
          : state.documento_tipo_nombre,
    }),
  ),
  on(configuracionActionClear, () => {
    return {
      ...initialState,
    };
  }),
);
