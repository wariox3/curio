import { Component, computed, inject, OnInit } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';
import { DecimalPipe, } from '@angular/common';

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

  public cantidadItemsSignal = this._facturaReduxService.cantidadItemsSignal
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal

  retirarItem(itemId: number){
    this._facturaReduxService.retirarItem(itemId)
  }

  actualizarCantidad(cantidad: number, itemId: number,){
    this._facturaReduxService.actualizarCantidadItem(itemId, cantidad)
    this._facturaReduxService.calcularSubtotal(itemId)
  }
}
