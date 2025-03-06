import 'hammerjs';
import { HammerModule } from '@angular/platform-browser';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsApp, StoreApp } from './redux';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { httpErrorInterceptor } from '@interceptores/manejo-errores/http-error.interceptor';
import { tokenInterceptor } from '@interceptores/token/token.interceptor';
import { reemplazarUrlInterceptor } from '@interceptores/url-contenedor/reemplazar-url.interceptor';
import { usuarioActionClear } from '@redux/actions/usuario.actions';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    // Si se despacha la acción para limpiar usuario, también limpia el localStorage
    if (action.type === usuarioActionClear.type) {
      localStorage.clear(); // Borra todo el localStorage
      state = {}; // Limpia todo el estado global si lo deseas
    }
    return localStorageSync({
      keys: ['facturacion', 'contenedor'], // Incluye 'usuario' si también lo tienes persistido
      rehydrate: true,
    })(reducer)(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        httpErrorInterceptor,
        reemplazarUrlInterceptor,
      ])
    ),
    importProvidersFrom(
      HammerModule,
      StoreModule.forRoot(StoreApp, { metaReducers }),
      EffectsModule.forRoot(EffectsApp),
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: !isDevMode(), // Restrict extension to log-only mode
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
        traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      }),
      SweetAlert2Module.forRoot()
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
