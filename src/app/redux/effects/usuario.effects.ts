import { Injectable } from '@angular/core';
//import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class UsuarioEffects {

  guardarUsuario$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          if (environment.production) {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: calcularTresHoras,
              path: '/',
              domain: environment.dominioApp,
            });
          } else {
            setCookie('usuario', JSON.stringify(action.usuario), {
              expires: calcularTresHoras,
              path: '/',
            });
          }
        })
      ),
    { dispatch: false }
  );



  constructor(private actions$: Actions) {}
}
