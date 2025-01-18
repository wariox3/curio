import { Routes } from '@angular/router';

export default [
  {
    path: 'dashboard',
    canActivate: [],
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
    //   {
    //     path: '',
    //     loadChildren: () => import('../modules'),
    //   },
    ],
  },
] as Routes;
