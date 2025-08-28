import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PaginadorComponent } from '@componentes/ui/paginador/paginador.component';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';
import { LoaderComponent } from '../../../../shared/components/ui/loader/loader.component';
import { HistorialApiService } from '../../services/historial-api.service';

@Component({
  selector: 'app-historial-lista',
  standalone: true,
  imports: [LoaderComponent, SiNoPipe, DecimalPipe, PaginadorComponent],
  templateUrl: './historial-lista.component.html',
  styleUrls: ['./historial-lista.component.scss'],
})
export default class HistorialListaComponent {
  private _historialApiService = inject(HistorialApiService);
  private _generalApiService = inject(GeneralApiService);
  private _destroy$ = new Subject<void>();

  public visualizarLoader = signal(false);
  public cantidadItemsSignal = this._historialApiService.cantidadItemsSignal;
  public arrFacturasSignal = this._historialApiService.arrFacturasSignal;

  ngOnInit(): void {
    this.consultarLista();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  consultarLista() {
    this._cargarLista();
  }

  descargarPDF(documentoId: number, documentoTipoId: number) {
    this._generalApiService.imprimirDocumento(documentoTipoId, documentoId);
  }

  onPageChange(page: number): void {
    this._historialApiService
      .historial({
        page,
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  private _mostrarLoader(): void {
    this.visualizarLoader.set(true);
  }

  private _ocultarLoader(): void {
    setTimeout(() => this.visualizarLoader.set(false), 300);
  }

  private _cargarLista(): void {
    this._historialApiService
      .historial()
      .pipe(
        tap(() => this._ocultarLoader()),
        catchError((error) => {
          this._manejarError(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  private _manejarError(error: any): void {
    this._ocultarLoader();
  }
}
