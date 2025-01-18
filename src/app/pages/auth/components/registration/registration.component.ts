import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet,
    NgIf,
    RouterLink,
  ],
})
export default class RegistrationComponent  implements OnInit {
  formularioRegistro: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarClave: 'text' | 'password' = 'password';
  visualizarLoader: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
  }

  visualizarConfirmarClave() {
    if (this.cambiarTipoCampoConfirmarClave === 'password') {
      this.cambiarTipoCampoConfirmarClave = 'text';
    } else {
      this.cambiarTipoCampoConfirmarClave = 'password';
    }
  }

  initForm() {
    this.formularioRegistro = this.formBuilder.group(
      {
        usuario: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
          ]),
        ],
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_*]+$/),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_*]+$/),
          ]),
        ],
        terminosCondiciones: [
          false,
          Validators.compose([Validators.requiredTrue]),
        ],
      },
      {
        //validator: ConfirmPasswordValidator.validarClave,
      }
    );
  }

  get formFields() {
    return this.formularioRegistro.controls;
  }

  submit() {
    // if (this.formularioRegistro.valid) {
    //   this.visualizarLoader = true;
    //   this.authService
    //     .registration(this.formularioRegistro.value)
    //     .pipe(
    //       switchMap(() =>
    //         this.authService.login(
    //           this.formFields.usuario.value,
    //           this.formFields.clave.value
    //         )
    //       ),
    //       tap((respuestaLogin) => {
    //         this.authService.loginExitoso(respuestaLogin.user);
    //       }),
    //       catchError(() => {
    //         this.visualizarLoader = false;
    //         this.changeDetectorRef.detectChanges();
    //         return of(null);
    //       })
    //     )
    //     .subscribe();
    // } else {
    //   this.formularioRegistro.markAllAsTouched();
    // }
  }
}
