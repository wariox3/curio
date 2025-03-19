import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Contenedor,
  ContenedorDetalle,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from '@redux/actions/contenedor.actions';
import {
  obtenerContenedor,
  obtenerContenedorId,
  obtenerContenedorNombre,
  obtenerContenedorSeleccion,
  obtenerContenedorSubdominio,
} from '@redux/selectors/contenedor.selectors';
import { getCookie } from 'typescript-cookie';
import { ConfiguracionReduxService } from './configuracion-redux.service';

@Injectable({
  providedIn: 'root',
})
export class ContenedorReduxService {
  private _store = inject(Store);
  public contendorId = signal(0);
  public contendorSubdomino = signal('');

  constructor() {
    this.obtenerContendor();
    this._obtenerContendorId();
  }

  obtenerNombre() {
    return this._store.selectSignal(obtenerContenedorNombre)();
  }

  cargarContenedor(contenedor: ContenedorDetalle) {
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

  obtenerContendorSubdominio() {
    return this._store
      .select(obtenerContenedorSubdominio)
      .subscribe((nombre) => this.contendorSubdomino.set(nombre));
  }

  obtenerContendor() {
    return this._store.selectSignal(obtenerContenedor)();
  }

  limpiarContenedor() {
    return this._store.dispatch(ContenedorActionBorrarInformacion());
  }

  validarExistenciaContenedorCookie() {
    let ruta = window.location.pathname;
    if (ruta.includes("dashboard/facturacion")) {
      let indiceUltimaBarra = ruta.lastIndexOf('/');
      if (indiceUltimaBarra !== -1) {
        let ultimoSegmento = ruta.substring(indiceUltimaBarra + 1); // Obtener el segmento después del último '/'
        if (ultimoSegmento !== 'facturacion') {
          let datosContenedor = getCookie(`contenedor-${ultimoSegmento}`);
          if (datosContenedor !== undefined) {
            this.cargarContenedor(JSON.parse(datosContenedor));
          } else {
            return false; // Se usa para que AutentificacionGuard redireccione a auth
          }
        }
      }
    }
    return true;
  }

  private _obtenerContendorId() {
    this._store
      .select(obtenerContenedorId)
      .subscribe((id) => this.contendorId.set(id));
  }
}
