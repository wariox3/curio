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
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsApp, StoreApp } from './redux';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { tokenInterceptor } from '@interceptores/token.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { httpErrorInterceptor } from '@interceptores/manejo-errores/http-error.interceptor';


export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: ['usuario', 'factura'], // Las partes del estado que quieres persistir
    rehydrate: true, // Restaura el estado desde el localStorage al iniciar
  })(reducer);
}
export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];


export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor, httpErrorInterceptor])),
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
