import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaTiposBusqueda } from '@type/factura-tipos-busqueda.type';
import { ItemApiService } from '../../services/item-api.service';

@Component({
  selector: 'app-factura-buscar-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './factura-buscar-item.component.html',
  styleUrl: './factura-buscar-item.component.scss',
})
export class FacturaBuscarItemComponent {
  private _itemApi = inject(ItemApiService);
  public tipoBusqueda = signal<FacturaTiposBusqueda>('id');
  public inputBusqueda: string| null = null

  seleccionarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this._actualizarTipoBusqueda(tipoBusqueda);
  }

  buscarCampo(){
    if(this.inputBusqueda !== ''){
      this._itemApi.busquedaId(this.inputBusqueda).subscribe()
    } else {
      this._itemApi.lista().subscribe()
    }
  }

  limpiarBusqueda(){
    this.inputBusqueda = null
    this._itemApi.lista().subscribe()
  }

  private _actualizarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this.tipoBusqueda.update(() => tipoBusqueda);
  }


}
