import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GeneralClass } from 'src/app/core/classes/general.class';
import { SidebarMenu } from 'src/app/core/model/general/sidebar/sidebar-menu.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent extends GeneralClass {
  @HostBinding('class') hostClass =
    'sidebar dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed z-20 hidden lg:flex flex-col items-stretch shrink-0';
  @HostBinding('attr.data-drawer') drawer = 'true';
  @HostBinding('attr.data-drawer-class') drawerClass =
    'drawer drawer-start top-0 bottom-0';
  @HostBinding('attr.data-drawer-enable') drawerEnable = 'true|lg:false';
  @HostBinding('attr.id') id = 'sidebar';

  public sidebarMenu: SidebarMenu[] = [
    {
      nombre: 'Inicio',
      link: '/dashboard/facturacion',
      iconoClase: 'ki-outline ki-home',
      activo: false,
    },
    {
      nombre: 'Historial',
      link: '/dashboard/historial',
      iconoClase: 'ki-outline ki-book-square',
      activo: false,
    },
    {
      nombre: 'Cuadre de caja',
      link: '/dashboard/cuadre_caja',
      iconoClase: 'ki-outline ki-questionnaire-tablet',
      activo: false,
    },
    // {
    //   nombre: 'Tráfico',
    //   link: '/admin/trafico/lista',
    //   iconoClase: 'ki-filled ki-delivery',
    //   activo: false,
    // },
    // {
    //   nombre: 'Movimiento',
    //   link: '',
    //   iconoClase: 'ki-filled ki-book',
    //   activo: false,
    //   tipoAcordion: true,
    //   children: [
    //     {
    //       nombre: 'Visita',
    //       link: '/admin/visita/lista',
    //     },
    //     {
    //       nombre: 'Despacho',
    //       link: '/admin/despacho/lista',
    //     },
    //   ],
    // },
    // {
    //   nombre: 'Administración',
    //   link: '',
    //   iconoClase: 'ki-filled ki-setting-2',
    //   activo: false,
    //   tipoAcordion: true,
    //   children: [
    //     {
    //       nombre: 'Vehículos',
    //       link: '/admin/vehiculo/lista',
    //     },
    //     {
    //       nombre: 'Contactos',
    //       link: '/admin/contacto/lista',
    //     },
    //     {
    //       nombre: 'Franjas',
    //       link: '/admin/franja/lista',
    //     },
    //   ],
    // },
    // {
    //   nombre: 'Complementos',
    //   link: '/admin/complemento/lista',
    //   iconoClase: 'ki-filled ki-plus-squared',
    //   activo: false,
    // },
  ];

  isActive(link: string): boolean {
    return this.router.url === link;
  }
}
