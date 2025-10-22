import { Component, inject, OnInit, signal } from '@angular/core';
import { FacturaItemsCardComponent } from '../factura-items-card/factura-items-card.component';
import { catchError, of, tap } from 'rxjs';
import { ItemApiService } from 'src/app/modules/general/services/item.service';
import { Store } from '@ngrx/store';
import { obtenerContactoPrecioId } from '@redux/selectors/factura.selectors';

@Component({
  selector: 'app-factura-items-lista',
  standalone: true,
  imports: [FacturaItemsCardComponent],
  templateUrl: './factura-items-lista.component.html',
  styleUrl: './factura-items-lista.component.scss',
})
export class FacturaItemsListaComponent implements OnInit {
  private _itemApi = inject(ItemApiService);
  private _store = inject(Store);
  public visualizarLoader = signal(false);
  public arrItemsSignal = this._itemApi.arrItemsSignal;
  public contactoPrecioId = signal(0);

  ngOnInit(): void {
    this.obtenerInfoCliente();
    this._mostrarLoader();
    this.consultarLista();
  }

  obtenerInfoCliente() {
    this._store
      .select(obtenerContactoPrecioId)
      .subscribe((contactoPrecioId) => {
        this.contactoPrecioId.set(contactoPrecioId);
      });
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
    this._itemApi
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

  public ordenarPorFavorito(itemId: number): void {
    this._mostrarLoader();
    // Obtener el array actual de items
    const items = this.arrItemsSignal();

    // Actualizar la propiedad 'favorito' del item correspondiente
    const itemsActualizados = items.map((item) =>
      item.id === itemId ? { ...item, favorito: !item.favorito } : item,
    );
    // Ordenar los items por 'favorito'
    const itemsOrdenados = itemsActualizados.sort(
      (a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0),
    );

    this.arrItemsSignal.set([]);

    // Actualizar la señal con el nuevo array ordenado
    this.arrItemsSignal.set(itemsOrdenados);
    this._ocultarLoader();
  }
}
