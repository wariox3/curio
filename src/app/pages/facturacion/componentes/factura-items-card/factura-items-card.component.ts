import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Item } from '@interfaces/item.interface';

@Component({
  selector: 'app-factura-items-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './factura-items-card.component.html',
})
export class FacturaItemsCardComponent {

  @Input() item: Item

  public visualizarSeleccionarProductoSignal = signal(false)

  seleccionarProducto(){
    this.visualizarSeleccionarProductoSignal.update((valor) => !valor);
  }
}
