import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./auth.component'),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component'),
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./components/registration/registration.component'),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/forgot-password/forgot-password.component'),
      },
      {
        path: 'logout',
        loadComponent: () => import('./components/logout/logout.component'),
      },
      {
        path: 'verificacion/:token',
        loadComponent: () =>
          import(
            './components/verificacion-cuenta/verificacion-cuenta.component'
          ),
      },
      {
        path: 'clave/cambiar/:token',
        loadComponent: () =>
          import('./components/reiniciar-clave/reiniciar-clave.component'),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
] as Routes;
