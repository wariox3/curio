import { NgClass } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Item } from '@interfaces/item.interface';
import { FacturaReduxService } from '../../services/factura-redux.service';

@Component({
  selector: 'app-factura-items-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './factura-items-card.component.html',
})
export class FacturaItemsCardComponent {

  private _facturaReduxService = inject(FacturaReduxService)

  @Input() item: Item

  public visualizarSeleccionarProductoSignal = signal(false)

  seleccionarProducto(item: Item) {
    this._alternarVistaSeleccionarProducto();
    this._agregarProductoAFactura(item);
    this._facturaReduxService.calcularSubtotal(item.id)
  }

  private _alternarVistaSeleccionarProducto() {
    this.visualizarSeleccionarProductoSignal.update((valor) => !valor);
  }

  _agregarProductoAFactura(item: Item) {
    this._facturaReduxService.agregarItem(item);
  }


}
