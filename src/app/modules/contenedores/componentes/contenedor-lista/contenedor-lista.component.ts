import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@componentes/ui/button/button.component';
import {
  ContenedorDetalle,
  ContenedorLista,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioId,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ConfiguracionGeneralApiService } from 'src/app/modules/configuracion/services/configuracion-general-api.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ContenedorReduxService } from '../../../../redux/services/contenedor-redux.service';
import { ContenedorApiService } from '../../services/contenedor-api.service';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contenedor-lista',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
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
  private _ConfiguracionReduxService = inject(ConfiguracionReduxService);

  private searchTerms = new Subject<string>();
  public searchTerm: string = '';
  public digitalOceanUrl = environment.digitalOceanUrl;
  public arrConectando: boolean[] = [];
  public fechaActual = new Date();
  public fechaLimitePago = signal<Date>(new Date());
  public saldo = signal<number>(0);
  public arrContenedores = signal<ContenedorLista[]>([]);
  public habilitarContenedores = signal<boolean>(true);
  public filtroNombre = signal<string>('');
  public contenedoresFiltrados = computed(() => {
    return this.arrContenedores().filter((contenedor) =>
      contenedor.contenedor__nombre
        .toLowerCase()
        .includes(this.filtroNombre().toLowerCase()),
    );
  });

  ngOnInit() {
    this.consultarLista();
    this.verificarEstadoPago();
    // Configurar la búsqueda con debounce
    this.searchTerms
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.consultarLista();
      });
  }

  verificarEstadoPago() {
    combineLatest([
      this._store.select(obtenerUsuarioFechaLimitePago),
      this._store.select(obtenerUsuarioVrSaldo),
    ]).subscribe(([fechaLimitePago, saldo]) => {
      const fechaLimite = new Date(
        new Date(fechaLimitePago).getTime() + 24 * 60 * 60 * 1000,
      );
      this.fechaLimitePago.set(fechaLimite);
      this.saldo.set(saldo);

      if (this.saldo() > 0 && this.fechaLimitePago() < this.fechaActual) {
        this.habilitarContenedores.set(false);
      }
    });
  }

  consultarLista() {
    this._store
      .select(obtenerUsuarioId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((respuestaUsuarioId) => {
          const params: Record<string, any> = {
            usuario_id: respuestaUsuarioId,
            // page: this.currentPage(),
          };

          // Agregar el parámetro de búsqueda solo si hay un término
          if (this.searchTerm) {
            params['contenedor__nombre'] = this.searchTerm;
          }

          return this._contenedorService.lista(params);
        }),
        tap((respuestaLista) => {
          respuestaLista.results.forEach(() => this.arrConectando.push(false));
          this.arrContenedores.set(respuestaLista.results);
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

  onSearchChange(term: string) {
    // this.currentPage.set(1);
    this.searchTerms.next(term);
  }
}
