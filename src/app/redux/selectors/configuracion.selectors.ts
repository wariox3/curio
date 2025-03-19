import { createFeatureSelector, createSelector } from '@ngrx/store';

const Configuracion = createFeatureSelector<any>('configuracion');



export const obtenerConfiguracionContenedorId = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.contenedor_id,
);


export const obtenerConfiguracionNombre = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.documento_tipo_nombre,
);

export const obtenerConfiguracionDocumentoTipoId = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.documento_tipo_id,
);
