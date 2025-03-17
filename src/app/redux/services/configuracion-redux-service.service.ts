import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  actualizarNombrePorContenedor,
  ConfiguracionActionInit,
} from '@redux/actions/configuracion.actions';
import { obtenerConfiguracionNombre } from '@redux/selectors/configuracion.selectors';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionReduxServiceService {
  private _store = inject(Store);

  constructor() {}

  actualizarNombre(nombre) {
    this._store.dispatch(
      actualizarNombrePorContenedor({ contenedorId: 313, nombre }),
    );
  }

  obtenerNombre() {
    return this._store.selectSignal(obtenerConfiguracionNombre)();
  }

  cargarConfiguracion(configuracion: any) {
    const nuevoConfiguracion: any = {
      documento_tipo_nombre: configuracion.nombre,
      documento_tipo_id: configuracion.id,
      contendor: configuracion.contenedor,
    };
    this._store.dispatch(
      ConfiguracionActionInit({ configuracion: nuevoConfiguracion }),
    );
  }
}
