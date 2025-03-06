import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { catchError, of, tap } from 'rxjs';
import { FormErrorComponent } from "../../../../shared/components/form/form-error/form-error.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, FormErrorComponent],
})
export default class LoginComponent implements OnInit {
  loginForm: FormGroup;
  visualizarLoader =  signal(false);
  cambiarTipoCampoClave = signal<'text' | 'password'>('password');

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _store = inject(Store);
  private _router = inject(Router);

  ngOnInit(): void {
    this.initForm();
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave() === 'password') {
      this.cambiarTipoCampoClave.set('text');
    } else {
      this.cambiarTipoCampoClave.set('password');
    }
  }

  initForm() {
    this.loginForm = this._formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          Validators.minLength(3),
          Validators.maxLength(320),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.visualizarLoader.set(true);
      this._authService
        .login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        )
        .pipe(
          tap((respuestaLogin) => {
            this._store.dispatch(
              usuarioActionInit({
                usuario: {
                  id: respuestaLogin.user.id,
                  username: respuestaLogin.user.username,
                  imagen: respuestaLogin.user.imagen,
                  nombre_corto: respuestaLogin.user.nombre_corto,
                  nombre: respuestaLogin.user.nombre,
                  apellido: respuestaLogin.user.apellido,
                  telefono: respuestaLogin.user.telefono,
                  correo: respuestaLogin.user.correo,
                  idioma: respuestaLogin.user.idioma,
                  dominio: respuestaLogin.user.dominio,
                  fecha_limite_pago: new Date(
                    respuestaLogin.user.fecha_limite_pago
                  ),
                  vr_saldo: respuestaLogin.user.vr_saldo,
                  fecha_creacion: new Date(respuestaLogin.user.fecha_creacion),
                  verificado: respuestaLogin.user.verificado,
                  es_socio: respuestaLogin.user.es_socio,
                  socio_id: respuestaLogin.user.socio_id,
                  is_active: respuestaLogin.user.is_active,
                },
              })
            );
          }),
          tap(() => this._router.navigate(['/contenedor'])),
          catchError(() => {
            this.visualizarLoader.set(false);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
