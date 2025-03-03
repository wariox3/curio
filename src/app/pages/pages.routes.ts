import { Routes } from '@angular/router';

export default [
  {
    path: 'dashboard',
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'facturacion',
        loadComponent: () => import('./facturacion/componentes/base-facturacion/base-facturacion.component'),
      },
    ],
  },
] as Routes;
