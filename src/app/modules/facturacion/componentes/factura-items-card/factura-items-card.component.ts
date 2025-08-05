import { DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnInit, signal, output, SimpleChanges, OnChanges } from '@angular/core';
import { Item } from '@interfaces/item.interface';
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';
import { ItemApiService } from '../../services/item-api.service';
import { tap } from 'rxjs';
import { TruncatePipe } from '@pipe/truncate.pipe';

@Component({
  selector: 'app-factura-items-card',
  standalone: true,
  imports: [NgClass, DecimalPipe, TruncatePipe],
  templateUrl: './factura-items-card.component.html',
})
export class FacturaItemsCardComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);
  private _itemApiService = inject(ItemApiService);
  public cantidadSignal = signal(0);
  public emirtFavorito = output<number>()

  @Input() item: Item;

  ngOnInit(): void {
    this._itemCantidad(this.item.id);
  }


  seleccionarProducto(item: Item) {
    this._itemApiService
      .detalle(item.id)
      .pipe(
        tap((respuestaItemDetalle) => {
          if (this.cantidadSignal() === 0) {
            this._agregarProductoAFactura(respuestaItemDetalle.item);
            this._itemCantidad(item.id);
          } else {
            this._agregarNuevaCantidad(respuestaItemDetalle.item);
            this._itemCantidad(item.id);
          }
          this._facturaReduxService.calcularValoresFacturaActivaDetalle(
            item.id
          );
          this._facturaReduxService.calcularValoresFacturaActivaEncabezado();
        })
      )
      .subscribe();
  }

  seleccionarFavorito(item: Item){
    this._itemFavorito(item.id)
    this.emirtFavorito.emit(item.id)
  }

  private _agregarNuevaCantidad(item: Item) {
    this.cantidadSignal.update((cantidad) => (cantidad += 1));
    this._facturaReduxService.actualizarCantidadItem(
      item.id,
      this.cantidadSignal()
    );
  }

  private _agregarProductoAFactura(item: Item) {
    this._facturaReduxService.agregarItem(item);
  }

  private _itemCantidad(itemId: number) {
    this._facturaReduxService
      .obtenerItemCantidad(itemId)
      .subscribe((cantidad) => {
        this.cantidadSignal.set(cantidad);
        if (this.cantidadSignal() === 0) {
          this.cantidadSignal.set(0);
        }
      });
  }

  private _itemFavorito(itemId: number){
    this._itemApiService.actualizarFavorito(itemId, {favorito: !this.item.favorito}).subscribe()
  }
}
