import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: ()=> import('./auth.component').then(c => c.AuthComponent) ,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: ()=> import('./components/login/login.component').then(c => c.LoginComponent) ,
      },
      {
        path: 'login/:token',
        loadComponent: ()=> import('./components/login/login.component').then(c => c.LoginComponent) ,
      },
      {
        path: 'registration',
        loadComponent: ()=> import('./components/registration/registration.component').then(c => c.RegistrationComponent) ,
      },
      {
        path: 'forgot-password',
        loadComponent: ()=> import('./components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent) ,
      },
      {
        path: 'logout',
        loadComponent: ()=> import('./components/logout/logout.component').then(c => c.LogoutComponent) ,
      },
      {
        path: 'verificacion/:token',
        loadComponent: ()=> import('./components/verificacion-cuenta/verificacion-cuenta.component').then(c => c.VerificacionCuentaComponent) ,
      },
      {
        path: 'clave/cambiar/:token',
        loadComponent: ()=> import('./components/reiniciar-clave/reiniciar-clave.component').then(c => c.ReiniciarClaveComponent) ,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
