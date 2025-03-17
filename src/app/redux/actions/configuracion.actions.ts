import { createAction, props } from '@ngrx/store';

export const configuracionAction = createAction('[configuracion] lista');

export const ConfiguracionActionInit = createAction(
  '[configuracion] nueva',
  props<{ configuracion: any }>()
);

export const actualizarNombrePorContenedor = createAction(
  '[Configuración] Actualizar Nombre por Contenedor',
  props<{ contenedorId: number; nombre: string }>()
);
