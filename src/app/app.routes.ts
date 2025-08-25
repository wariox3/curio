import { Routes } from '@angular/router';
import { AutentificacionGuard } from '@guardias/auth.guard';
import { cookieRequiredGuard } from '@guardias/cookie-required.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes'),
  },
  {
    path: '',
    canActivate: [AutentificacionGuard, cookieRequiredGuard],
    loadChildren: () => import('./modules/pages.routes'),
  },
  { path: '**', redirectTo: 'auth' },
];
