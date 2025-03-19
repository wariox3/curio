import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@componentes/ui/button/button.component';
import {
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ContenedorApiService } from '../../services/contenedor-api.service';
import { ContenedorReduxService } from '../../../../redux/services/contenedor-redux.service';
import { ConfiguracionGeneralApiService } from 'src/app/pages/Configuraciones/services/configuracion-general-api.service';
import { ConfiguracionReduxServiceService } from '@redux/services/configuracion-redux-service.service';

@Component({
  selector: 'app-contenedor-lista',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './contenedor-lista.component.html',
})
export default class ContenedorListaComponent implements OnInit {
  private _contenedorService = inject(ContenedorApiService);
  private _configuracionGeneralApiService = inject(
    ConfiguracionGeneralApiService,
  );
  private _contenedorReduxService = inject(ContenedorReduxService);
  private _configuracionReduxServiceService = inject(
    ConfiguracionReduxServiceService,
  );
  private _store = inject(Store);
  private _alertaService = inject(AlertaService);
  private _router = inject(Router);
  public arrConectando: boolean[] = [];
  public arrContenedores = signal<any[]>([]);
  public filtroNombre = signal<string>('');

  public contenedoresFiltrados = computed(() => {
    return this.arrContenedores().filter((contenedor) =>
      contenedor.nombre
        .toLowerCase()
        .includes(this.filtroNombre().toLowerCase()),
    );
  });

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    this._store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this._contenedorService.lista(respuestaUsuarioId.toString()),
        ),
        tap((respuestaLista: ListaContenedoresRespuesta) => {
          respuestaLista.contenedores.forEach(() =>
            this.arrConectando.push(false),
          );
          this.arrContenedores.set(respuestaLista.contenedores);
        }),
        catchError(({ error }) => {
          this._alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`,
          );
          return of(null);
        }),
      )
      .subscribe();
  }

  seleccionarEmpresa(contenedor_id: string, indexContenedor: number) {
    this.arrConectando[indexContenedor] = true;
    this._contenedorService
      .detalle(contenedor_id)
      .pipe(
        tap((respuesta: ContenedorDetalle) => {
          this._contenedorReduxService.cargarContenedor(respuesta);
          this.arrConectando[indexContenedor] = false;
        }),
        switchMap(() => {
          return this._contenedorService.contedorConfiguracion();
        }),
        switchMap((respuestaConfiguracion: any) => {
          if (respuestaConfiguracion.pos_documento_tipo) {
            return this._configuracionGeneralApiService.detalleConfiguracion(
              respuestaConfiguracion.pos_documento_tipo,
            );
          }
          return of(false);
        }),
        tap((respuesta: any) => {
          this._configuracionReduxServiceService.cargarConfiguracion({
            documento_tipo_id: respuesta.id ?? '',
            documento_tipo_nombre: respuesta.nombre ?? '',
            contenedor_id: this._contenedorReduxService.contendorId(),
          });
        }),
        tap(() => this._router.navigate(['/dashboard/facturacion'])),
        catchError(() => {
          this.arrConectando[indexContenedor] = false;
          return of(null);
        }),
      )
      .subscribe();
  }

  buscarContendor($event: Event) {
    let valor = $event.target as HTMLInputElement;
    this.filtroNombre.set(valor.value);
  }
}
