import { Component, computed, inject, OnInit } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';
import { ItemApiService } from '../../services/item-api.service';
import { DecimalPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [ContadorCantidadComponent,  DecimalPipe],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent  {
  private _facturaReduxService = inject(FacturaReduxService);

  public nombre = this._facturaReduxService.facturaActivaNombre;
  public items = this._facturaReduxService.arrItemsSignal

  public cantidadItemsSignal = computed(() => this._facturaReduxService.arrItemsSignal().length)
  public totalPrecioSignal = computed(() =>
    this._facturaReduxService.arrItemsSignal().reduce((acumulador, item) => acumulador + item.precio, 0)
  );

  retirarItem(itemId: number){
    this._facturaReduxService.retirarItem(0,itemId)
  }
}
