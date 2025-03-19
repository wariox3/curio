import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  actualizarDocumentoTipoIdPorContenedor,
  actualizarDocumentoTipoNombrePorContenedor,
  configuracionActionClear,
  ConfiguracionActionInit,
} from '@redux/actions/configuracion.actions';
import {
  obtenerConfiguracionDocumentoTipoId,
  obtenerConfiguracionNombre,
} from '@redux/selectors/configuracion.selectors';
import { ContenedorReduxService } from './contenedor-redux.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionReduxServiceService {
  private _store = inject(Store);
  private _contenedorReduxService = inject(ContenedorReduxService);

  constructor() {}

  actualizarDocumentoTipoId(documento_tipo_id: string) {
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

  obtenerNombre() {
    return this._store.selectSignal(obtenerConfiguracionNombre)();
  }

  obtenerDocumentoTipoId() {
    return this._store.selectSignal(obtenerConfiguracionDocumentoTipoId)();
  }

  cargarConfiguracion(configuracion: any) {
    this._store.dispatch(ConfiguracionActionInit({ configuracion }));
  }

  limpiarConfiguracion() {
    this._store.dispatch(configuracionActionClear());
  }
}
