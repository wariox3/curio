import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaTiposBusqueda } from '@type/factura-tipos-busqueda.type';

@Component({
  selector: 'app-factura-buscar-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './factura-buscar-item.component.html',
  styleUrl: './factura-buscar-item.component.scss',
})
export class FacturaBuscarItemComponent {
  public tipoBusqueda = signal<FacturaTiposBusqueda>('id_nombre');
  public inputBusqueda: string| null = null

  seleccionarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this._actualizarTipoBusqueda(tipoBusqueda);
  }

  private _actualizarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this.tipoBusqueda.update(() => tipoBusqueda);
  }
  

}
