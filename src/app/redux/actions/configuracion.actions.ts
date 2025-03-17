import { createAction, props } from '@ngrx/store';

export const configuracionAction = createAction('[configuracion] lista');

export const ConfiguracionActionInit = createAction(
  '[configuracion] nueva',
  props<{ configuracion: any }>()
);

export const actualizarDocumentoTipoIdPorContenedor = createAction(
  '[Configuración] Actualizar Documento_tipo_id por Contenedor',
  props<{ contenedorId: number; documento_tipo_id: string }>()
);

export const actualizarDocumentoTipoNombrePorContenedor = createAction(
  '[Configuración] Actualizar Documento_tipo_Nombre por Contenedor',
  props<{ contenedorId: number; documento_tipo_nombre: string }>()
);
