import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@componentes/ui/button/button.component';
import {
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { obtenerUsuarioFechaLimitePago, obtenerUsuarioId, obtenerUsuarioSocio, obtenerUsuarioVrSaldo } from '@redux/selectors/usuario.selectors';
import { catchError, combineLatest, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ContenedorApiService } from '../../services/contenedor-api.service';
import { ContenedorReduxService } from '../../../../redux/services/contenedor-redux.service';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { ConfiguracionGeneralApiService } from 'src/app/modules/configuracion/services/configuracion-general-api.service';

@Component({
  selector: 'app-contenedor-lista',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './contenedor-lista.component.html',
})
export default class ContenedorListaComponent implements OnInit, OnDestroy {
  private _contenedorService = inject(ContenedorApiService);
  private _contenedorReduxService = inject(ContenedorReduxService);
  private _store = inject(Store);
  private _alertaService = inject(AlertaService);
  private _router = inject(Router);
  private destroy$ = new Subject<void>();
  private _configuracionGeneralApiService = inject(
    ConfiguracionGeneralApiService,
  );
  private _ConfiguracionReduxService = inject(
    ConfiguracionReduxService,
  );

  public arrConectando: boolean[] = [];
  public fechaActual = new Date();
  public fechaLimitePago = signal<Date>(new Date());
  public saldo = signal<number>(0);
  public arrContenedores = signal<any[]>([]);
  public habilitarContenedores = signal<boolean>(true);
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
    this.x();
  }

  x () {
    combineLatest([
      this._store.select(obtenerUsuarioFechaLimitePago),
      this._store.select(obtenerUsuarioVrSaldo),
    ]).subscribe(([fechaLimitePago, saldo]) => {
      const fechaLimite =  new Date(new Date(fechaLimitePago).getTime() + 24 * 60 * 60 * 1000);
      this.fechaLimitePago.set(fechaLimite)
      this.saldo.set(saldo);

      if (
        this.saldo() > 0 &&
        this.fechaLimitePago() < this.fechaActual
      ) {
        this.habilitarContenedores.set(false);
      }

    });
  }



  consultarLista() {
    this._store
      .select(obtenerUsuarioId)
      .pipe(
        takeUntil(this.destroy$),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  seleccionarEmpresa(contenedor_id: string, indexContenedor: number) {
    this.arrConectando[indexContenedor] = true;
    this._contenedorService
      .detalle(contenedor_id)
      .pipe(
        takeUntil(this.destroy$),
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
          this._ConfiguracionReduxService.cargarConfiguracion({
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
