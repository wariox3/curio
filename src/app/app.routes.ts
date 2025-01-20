import { Routes } from '@angular/router';
import { AutentificacionGuard } from '@guardias/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },
  {
    path: '',
    canActivate: [AutentificacionGuard],
    loadChildren: () => import('./pages/pages.routes'),
  },
  { path: '**', redirectTo: 'auth' },
];
