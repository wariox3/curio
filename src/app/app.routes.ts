import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.routes'),
  },
  { path: '**', redirectTo: 'auth' },
];
