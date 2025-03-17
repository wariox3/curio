import { createFeatureSelector, createSelector } from '@ngrx/store';

const Configuracion = createFeatureSelector<any>('configuracion');

export const obtenerConfiguracionNombre = createSelector(
  Configuracion,
  (Configuracion) => Configuracion.documento_tipo_nombre,
);
