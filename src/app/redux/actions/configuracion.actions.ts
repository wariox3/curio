import { createAction, props } from '@ngrx/store';

export const configuracionAction = createAction('[configuracion] lista');

export const ConfiguracionActionInit = createAction(
  '[configuracion] nueva',
  props<{ configuracion: any }>()
);

export const actualizarDocumentoTipoIdPorContenedor = createAction(
  '[Configuracion] Actualizar Documento_tipo_id por Contenedor',
  props<{ contenedorId: number; documento_tipo_id: number }>()
);

export const actualizarDocumentoTipoNombrePorContenedor = createAction(
  '[Configuracion] Actualizar Documento_tipo_Nombre por Contenedor',
  props<{ contenedorId: number; documento_tipo_nombre: string }>()
);

export const actualizarSede = createAction(
  '[Configuración] Actualizar Sede',
  props<{ sede: number }>()
);

export const configuracionActionClear = createAction(
  '[Configuracion] limpiar informacion',
);
