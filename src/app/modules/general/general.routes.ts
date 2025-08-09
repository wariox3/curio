import { Route } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'lista',
        loadComponent: () => import('./pages/item/item-lista/item-lista.component'),
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/item/item-formulario/item-formulario.component'),
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/item/item-formulario/item-formulario.component'),
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/item/item-detalle/item-detalle.component'),
      },
    ],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

export default routes;
