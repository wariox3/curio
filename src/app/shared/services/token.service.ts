import { jwtDecode, JwtPayload } from "jwt-decode";
import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { cookieKey } from "src/app/core/enums/cookie-key.enum";
// import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  guardarToken(token: string, tiempoCookie: Date) {
    setCookie(cookieKey.ACCESS_TOKEN, token, { 
      expires: tiempoCookie,
      path: '/',
    });
  }

  obtenerToken() {
    return getCookie(cookieKey.ACCESS_TOKEN);
  }

  eliminarToken() {
    removeCookie(cookieKey.ACCESS_TOKEN, { path: '/' });
  }

  eliminarTokens() {
    this.eliminarToken();
    this.eliminarRefreshToken();
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
