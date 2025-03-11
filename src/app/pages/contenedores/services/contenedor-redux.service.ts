import { inject, Injectable, signal } from '@angular/core';
import { Contenedor, ContenedorDetalle } from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { ContenedorActionBorrarInformacion, ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { obtenerContenedorId, obtenerContenedorSubdominio } from '@redux/selectors/contenedor.selectors';

@Injectable({
  providedIn: 'root'
})
export class ContenedorReduxService {
  private _store = inject(Store);
  public contendorId = signal(0);
  public contendorSubdomino = signal('');

  constructor() {
    this._obtenerContendorId()
  }

  private _obtenerContendorId(){
    this._store.select(obtenerContenedorId).subscribe((id) => this.contendorId.set(id))
  }

  cargarContenedor(contenedor: ContenedorDetalle){
    const nuevoContenedor: Contenedor = {
      nombre: contenedor.nombre,
      imagen: contenedor.imagen,
      contenedor_id: contenedor.id,
      subdominio: contenedor.subdominio,
      id: contenedor.id,
      usuario_id: contenedor.usuario_id,
      seleccion: true,
      rol: '',
      plan_id: contenedor.plan_id,
      plan_nombre: contenedor.plan_nombre,
      usuarios: contenedor.plan_limite_usuarios,
      usuarios_base: contenedor.plan_usuarios_base,
      reddoc: contenedor.reddoc,
      ruteo: contenedor.ruteo,
      acceso_restringido: contenedor.acceso_restringido,
    };
    this._store.dispatch(ContenedorActionInit({ contenedor: nuevoContenedor }));
  }

  obtenerContendorSubdominio(){
    return this._store.select(obtenerContenedorSubdominio).subscribe((nombre)=> this.contendorSubdomino.set(nombre))
  }

  limpiarContenedor(){
    return this._store.dispatch(ContenedorActionBorrarInformacion())
  }
}
