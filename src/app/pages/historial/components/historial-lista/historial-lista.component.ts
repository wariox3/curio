import { Component, inject, signal } from '@angular/core';
import { HistorialApiService } from '../../services/historial-api.service';
import { catchError, of, tap } from 'rxjs';
import { LoaderComponent } from '../../../../shared/components/ui/loader/loader.component';
import { HistorialItemCardComponent } from '../historial-item-card/historial-item-card.component';

@Component({
  selector: 'app-cuadre-caja-lista',
  standalone: true,
  imports: [LoaderComponent, HistorialItemCardComponent],
  templateUrl: './historial-lista.component.html',
})
export class HistorialListaComponent {
  private _historialApiService = inject(HistorialApiService);
  public visualizarLoader = signal(false);
  public arrFacturasSignal = this._historialApiService.arrFacturasSignal;

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this._cargarLista();
  }

  private _mostrarLoader(): void {
    this.visualizarLoader.set(true);
  }

  private _ocultarLoader(): void {
    setTimeout(() => this.visualizarLoader.set(false), 300);
  }

  private _cargarLista(): void {
    this._historialApiService
      .lista()
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
