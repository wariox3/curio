import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { obtenerUsuarioImagen, obtenerUsuarioNombre } from '@redux/selectors/usuario.selectors';

@Injectable({ providedIn: 'root' })
export class UsuarioReduxService {
  private _store = inject(Store);

  obtenerImagen() {
    return this._store.selectSignal(obtenerUsuarioImagen)();
  }

  obtenerNombre() {
    return this._store.selectSignal(obtenerUsuarioNombre)();
  }

}
