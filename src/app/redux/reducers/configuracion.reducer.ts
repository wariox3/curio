import { createReducer, on } from "@ngrx/store";
import { actualizarNombrePorContenedor, ConfiguracionActionInit } from "@redux/actions/configuracion.actions";

export const initialState: any = {
  documento_tipo_id: '',
  documento_tipo_nombre: '',
  contendor: 0
}

export const configuracionReducer = createReducer(
  initialState,
  on(ConfiguracionActionInit, (state, { configuracion }) => {
    return {
      ...state,
      ...configuracion,
    };
  }),
  on(actualizarNombrePorContenedor, (state, { contenedorId, nombre }) => ({
    ...state,
    documento_tipo_nombre: state.contendor === contenedorId ? nombre : state.nombre
  }))
);
