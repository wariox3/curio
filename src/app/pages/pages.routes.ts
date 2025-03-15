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
      {
        path: 'facturacion/:contenedor',
        loadComponent: () => import('./facturacion/componentes/base-facturacion/base-facturacion.component'),
      },
    ],
  },
  {
    path: 'contenedor',
    loadComponent: () => import('./contenedores-layout/contenedores-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('./contenedores/contenedor.routes'),
      },
    ],
  },
] as Routes;
