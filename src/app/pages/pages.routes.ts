import { Routes } from '@angular/router';

export default [
  {
    path: 'dashboard',
    loadComponent: () => import('./admin-layout/admin-layout.component'),
    children: [
      {
        path: 'facturacion',
        loadComponent: () =>
          import(
            './facturacion/componentes/facturacion-base/facturacion-base.component'
          ),
      },
      {
        path: 'facturacion/:contenedor',
        loadComponent: () =>
          import(
            './facturacion/componentes/facturacion-base/facturacion-base.component'
          ),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import(
            './Configuraciones/components/configuracion-base/configuracion-base.component'
          ),
      },
      {
        path: 'historial',
        loadChildren: () =>
          import('./historial/historial.routes').then((r) => r.routes),
      },
      {
        path: 'cuadre_caja',
        loadChildren: () =>
          import('./cuadre-caja/cuadre-caja.routes').then((r) => r.routes),
      }
    ],
  },
  {
    path: 'contenedor',
    loadComponent: () =>
      import('./contenedores-layout/contenedores-layout.component'),
    children: [
      {
        path: '',
        loadChildren: () => import('./contenedores/contenedor.routes'),
      },
    ],
  },
] as Routes;
