import { obtenerContenedorNombre } from './../../redux/selectors/contenedor.selectors';
import { Component, HostBinding, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ContenedorReduxService } from '@redux/services/contenedor-redux.service';
import { UsuarioReduxService } from '@redux/services/usuario.redux.service';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private _router = inject(Router);
  private _contenedorReduxService = inject(ContenedorReduxService);
  private _configuracionReduxService = inject(ConfiguracionReduxService);
  private _usuarioReduxService = inject(UsuarioReduxService);
  private _authService = inject(AuthService);

  public usuarioImagen = this._usuarioReduxService.obtenerImagen();
  public usuarioNombre = this._usuarioReduxService.obtenerNombre();
  public contendorNombre = this._contenedorReduxService.obtenerNombre();
  public configuracionContendorId = this._configuracionReduxService.obtenerContenedorId();

  @HostBinding('class') hostClass =
    'header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 shadow-sm dark:border-b dark:border-b-coal-100';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';


  cerrarSeccion() {
    this._authService.logout();
  }

  navegarAContenedores(): void {
    this.limpiarEstado();
    this.navegarAListaContenedores();
  }

  navegarConfiguracion() {
    this._router.navigate([`dashboard/configuracion`]);
  }


  private limpiarEstado(): void {
    this._contenedorReduxService.limpiarContenedor();
    this._configuracionReduxService.limpiarConfiguracion();
  }

  private navegarAListaContenedores(): void {
    const rutaDestino = '/contenedor/lista';
    this._router.navigate([rutaDestino]);
  }


}
