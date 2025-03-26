import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  actualizarDocumentoTipoIdPorContenedor,
  actualizarDocumentoTipoNombrePorContenedor,
  configuracionActionClear,
  ConfiguracionActionInit,
} from '@redux/actions/configuracion.actions';
import {
  obtenerConfiguracionContenedorId,
  obtenerConfiguracionDocumentoTipoId,
  obtenerConfiguracionNombre,
  obtenerConfiguracionSede,
} from '@redux/selectors/configuracion.selectors';
import { ContenedorReduxService } from './contenedor-redux.service';
import { ContenedorApiService } from 'src/app/pages/contenedores/services/contenedor-api.service';
import { of, switchMap, tap } from 'rxjs';
import { ConfiguracionGeneralApiService } from 'src/app/pages/configuracion/services/configuracion-general-api.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionReduxService {
  private _store = inject(Store);
  private _contenedorReduxService = inject(ContenedorReduxService);
  private _contenedorApiService = inject(ContenedorApiService);
  private _configuracionGeneralApiService = inject(
    ConfiguracionGeneralApiService,
  );

  constructor() {}

  actualizarDocumentoTipoId(documento_tipo_id: number) {
    this._store.dispatch(
      actualizarDocumentoTipoIdPorContenedor({
        contenedorId: this._contenedorReduxService.contendorId(),
        documento_tipo_id,
      }),
    );
  }

  actualizarDocumentoTipoNombre(documento_tipo_nombre: string) {
    this._store.dispatch(
      actualizarDocumentoTipoNombrePorContenedor({
        contenedorId: this._contenedorReduxService.contendorId(),
        documento_tipo_nombre,
      }),
    );
  }

  obtenerContenedorId() {
    return this._store.selectSignal(obtenerConfiguracionContenedorId)();
  }

  obtenerNombre() {
    return this._store.selectSignal(obtenerConfiguracionNombre)();
  }

  obtenerDocumentoTipoId() {
    return this._store.selectSignal(obtenerConfiguracionDocumentoTipoId)();
  }

  obtenerDocumentoSede() {
    return this._store.selectSignal(obtenerConfiguracionSede)();
  }

  cargarConfiguracion(configuracion: any) {
    this._store.dispatch(ConfiguracionActionInit({ configuracion }));
  }

  limpiarConfiguracion() {
    this._store.dispatch(configuracionActionClear());
  }

  validarConfiguracion(){
    this._contenedorApiService.contedorConfiguracion()
    .pipe(
        switchMap((respuestaConfiguracion: any) => {
          if (respuestaConfiguracion.pos_documento_tipo) {
            return this._configuracionGeneralApiService.detalleConfiguracion(
              respuestaConfiguracion.pos_documento_tipo,
            );
          }
          return of(false);
        }),
        tap((respuesta: any) => {
          this.cargarConfiguracion({
            documento_tipo_id: respuesta.id ?? '',
            documento_tipo_nombre: respuesta.nombre ?? '',
            contenedor_id: this._contenedorReduxService.contendorId(),
          });
        }),
    )
    .subscribe()
  }
}
