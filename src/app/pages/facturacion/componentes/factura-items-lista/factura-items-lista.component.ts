import { Component, inject, OnInit, signal } from '@angular/core';
import { FacturaItemsCardComponent } from '../factura-items-card/factura-items-card.component';
import { ItemApiService } from './../../services/item-api.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-factura-items-lista',
  standalone: true,
  imports: [FacturaItemsCardComponent],
  templateUrl: './factura-items-lista.component.html',
  styleUrl: './factura-items-lista.component.scss',
})
export class FacturaItemsListaComponent implements OnInit {
  private _itemApi = inject(ItemApiService);
  public visualizarLoader = signal(false);

  public arrItemsSignal = this._itemApi.arrItemsSignal;

  ngOnInit(): void {
    this.visualizarLoader.set(true);
    this._itemApi
      .lista()
      .pipe(
        tap(() => setTimeout(() => this.visualizarLoader.set(false), 300)),
        catchError(() => {
          this.visualizarLoader.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}
