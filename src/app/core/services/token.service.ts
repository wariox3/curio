import { jwtDecode, JwtPayload } from "jwt-decode";
import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
// import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  guardarToken(token: string) {
    let calcularTresHoras = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
    setCookie('token', token, {
      expires: calcularTresHoras,
      path: '/',
      //domain: environment.dominioApp,
    });
  }

  obtenerToken() {
    return getCookie('token');
  }

  eliminarToken() {
    // removeCookie('token', { path: '/', domain: environment.dominioApp });
    removeCookie('token', { path: '/' });
  }

  guardarRefreshToken(RefreshToken: string, calcularTresHoras: Date) {
    // if (environment.production) {
    //   setCookie('RefreshToken', RefreshToken, {
    //     expires: calcularTresHoras,
    //     path: '/',
    //     domain: environment.dominioApp,
    //   });
    // } else {
    //   setCookie('RefreshToken', RefreshToken, {
    //     expires: calcularTresHoras,
    //     path: '/',
    //   });
    // }
  }

  obtenerRefreshToken() {
    // const refreshToken = getCookie('RefreshToken');
    // return refreshToken;
  }

  eliminarRefreshToken() {
    // removeCookie('RefreshToken', { path: '/', domain: environment.dominioApp });
    // removeCookie('RefreshToken', { path: '/' });
  }

  validarToken() {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado = jwtDecode<JwtPayload>(token);
    if (tokenDecodificado && tokenDecodificado?.exp) {
      const tokenFecha = new Date(0);
      const fechaActual = new Date();
      tokenFecha.setUTCSeconds(tokenDecodificado.exp);
      return tokenFecha.getTime() > fechaActual.getTime();
    }
    return false;
  }

  validarRefreshToken() {
    // const token = this.obtenerRefreshToken();
    // if (!token) {
    //   return false;
    // }
    // const tokenDecodificado = jwt_decode<JwtPayload>(token);
    // if (tokenDecodificado && tokenDecodificado?.exp) {
    //   const tokenFecha = new Date(0);
    //   const fechaActual = new Date();
    //   tokenFecha.setUTCSeconds(tokenDecodificado.exp);
    //   return tokenFecha.getTime() > fechaActual.getTime();
    // }
    // return false;
  }
  
}
