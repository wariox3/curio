import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token } from '../interfaces/token.interface';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { noRequiereToken } from '@interceptores/token.interceptor';
import { tap } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { removeCookie } from 'typescript-cookie';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { usuarioActionClear } from '@redux/actions/usuario.actions';
// import { Router } from '@angular/router';
// import { noRequiereToken } from '@interceptores/token.interceptor';
// import { Usuario } from '@interfaces/usuario/usuario';
// import { Store } from '@ngrx/store';
// import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
// import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
// import { usuarioActionInit } from '@redux/actions/usuario.actions';
// import { BehaviorSubject, Observable, Subscription } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { removeCookie } from 'typescript-cookie';
// import { RecuperarClaveVerificacion } from '../interfaces/recuperacion-clave-verificacion.interface';
// import { TokenReenviarValidacion } from '../interfaces/token-reenviar-validacion.interface';
// import { TokenVerificacion } from '../interfaces/token-verificacion.interface';
// import { ConfimarcionClaveReinicio } from '../models/confimarcion-clave-reinicio';
// import { UserModel } from '../models/user.model';
// import { TokenService } from './token.service';
// import { ConfirmarInivitacion } from '../interfaces/confirmar-inivitacion.interface';
// import { ConsultarEstadoVerificado } from '../interfaces/consultar-estado-verificado';
//export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  private _http = inject(HttpClient);
  private _tokenService = inject(TokenService);
  private _router = inject(Router);
  // private tokenService = inject(TokenService);
  private _store = inject(Store);

  constructor() {}

  login(email: string, password: string) {
    return this._http
      .post<Token>(
        API_ENDPOINTS.SEGURIDAD.LOGIN,
        { username: email, password: password },
        { context: noRequiereToken() }
      )
      .pipe(
        tap((respuesta) => {

              this._tokenService.guardarToken(respuesta.token);
          //    this.tokenService.guardarRefreshToken(
          //      respuesta['refresh-token'],
          //      calcularTresHoras
          //    );
        })
      );
  }

  logout() {
    this._clearLocalStorage()
    this._removerCookies()
    this._tokenService.eliminarToken();
    this._store.dispatch(usuarioActionClear());
    // this.tokenService.eliminarRefreshToken();
    // this.store.dispatch(asignarDocumentacion({ id: 0, nombre: '' }));
  }

  private _clearLocalStorage () {
    localStorage.clear();
  }

  private _removerCookies(){
    // removeCookie('usuario', { path: '/', domain: environment.dominioApp });
    removeCookie('usuario', { path: '/' });
    // const patrones = ['empresa-', 'contenedor-', 'configuracion'];
    // document.cookie.split(';').forEach(function (cookie) {
    //   const cookieNombre = cookie.split('=')[0].trim();
    //   patrones.forEach(function (patron) {
    //     if (cookieNombre.startsWith(patron)) {
    //       removeCookie(cookieNombre);
    //       removeCookie(cookieNombre, {
    //         path: '/',
    //         domain: environment.dominioApp,
    //       });
    //     }
    //   });
    // });
    // if (environment.production) {
    //   window.location.href = `${
    //     environment.dominioHttp
    //   }://${environment.dominioApp.slice(1)}/inicio`;
    // } else {
      this._router.navigate(['/inicio']);
    // }
  }

  registration(data: any) {
    // return this.http.post<Usuario>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/`,
    //   {
    //     username: data.usuario,
    //     password: data.clave,
    //   },
    //   {
    //     context: noRequiereToken(),
    //   }
    // );
  }

  recuperarClave(email: string) {
    // return this.http.post<RecuperarClaveVerificacion>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave-solicitar/`,
    //   { username: email, accion: 'clave' },
    //   { context: noRequiereToken() }
    // );
  }

  validacion(token: string) {
    // return this.http.post<TokenVerificacion>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/verificar/`,
    //   { token },
    //   { context: noRequiereToken() }
    // );
  }

  reenviarValidacion(codigoUsuario: number) {
    // return this.http.post<TokenReenviarValidacion>(
    //   `${environment.URL_API_MUUP}/seguridad/verificacion/`,
    //   { codigoUsuario },
    //   { context: noRequiereToken() }
    // );
  }

  refreshToken(refreshToken: string) {
    // return this.http
    //   .post<Token>(`${environment.URL_API_MUUP}`, { refreshToken })
    //   .pipe(
    //     tap((respuesta: Token) => {
    //       let calcularTresHoras = new Date(
    //         new Date().getTime() + 3 * 60 * 60 * 1000
    //       );
    //       this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
    //       this.tokenService.guardarRefreshToken(
    //         respuesta['refresh-token'],
    //         calcularTresHoras
    //       );
    //     })
    //   );
  }

  reiniciarClave(password: string, token: string) {
    // return this.http.post<ConfimarcionClaveReinicio>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave-verificar/`,
    //   { password, token },
    //   { context: noRequiereToken() }
    // );
  }

  cambiarClave(usuario_id: string, password: string) {
    // return this.http.post<ConfimarcionClaveReinicio>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave/`,
    //   { usuario_id, password },
    //   { context: noRequiereToken() }
    // );
  }

  confirmarInivitacion(token: string) {
    // return this.http.post<ConfirmarInivitacion>(
    //   `${environment.URL_API_MUUP}/contenedor/usuariocontenedor/confirmar/`,
    //   {
    //     token,
    //   }
    // );
  }

  loginExitoso(usuario: any) {
    // this.store.dispatch(
    //   usuarioActionInit({
    //     usuario: {
    //       id: usuario.id,
    //       username: usuario.username,
    //       imagen: usuario.imagen,
    //       nombre_corto: usuario.nombre_corto,
    //       nombre: usuario.nombre,
    //       apellido: usuario.apellido,
    //       telefono: usuario.telefono,
    //       correo: usuario.correo,
    //       idioma: usuario.idioma,
    //       dominio: usuario.dominio,
    //       fecha_limite_pago: new Date(usuario.fecha_limite_pago),
    //       vr_saldo: usuario.vr_saldo,
    //       fecha_creacion: new Date(usuario.fecha_creacion),
    //       verificado: usuario.verificado,
    //       es_socio: usuario.es_socio,
    //       socio_id: usuario.socio_id,
    //       is_active: usuario.is_active,
    //     },
    //   })
    // );
    // if (window.location.host.includes(environment.dominioApp)) {
    //   this.store.dispatch(
    //     configuracionVisualizarAction({
    //       configuracion: {
    //         visualizarApps: true,
    //       },
    //     })
    //   );
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   location.href = `${
    //     environment.dominioHttp
    //   }://${environment.dominioApp.slice(1)}/contenedor/lista`;
    // }
  }

  consultarEstadoVerificado(usuario_id: string) {
    // return this.http.post<ConsultarEstadoVerificado>(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/estado-verificado/`,
    //   {
    //     usuario_id,
    //   }
    // );
  }

  ngOnDestroy() {
    //this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  listaSocio(socio_id: string) {
    // return this.http.post(
    //   `${environment.URL_API_MUUP}/seguridad/usuario/lista-socio/`,
    //   {
    //     socio_id,
    //   }
    // );
  }
}
