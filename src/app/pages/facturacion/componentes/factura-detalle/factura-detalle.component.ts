import { Component, computed, inject, OnInit } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';
import { DecimalPipe, } from '@angular/common';
import { FacturaOpcionesDropdownComponent } from "../factura-opciones-dropdown/factura-opciones-dropdown.component";

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [ContadorCantidadComponent, DecimalPipe, FacturaOpcionesDropdownComponent],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent  {
  private _facturaReduxService = inject(FacturaReduxService);
  public mostrarIcono: number | null = null;
  public nombre = this._facturaReduxService.facturaActivaNombre;
  public items = this._facturaReduxService.arrItemsSignal
  public totalProductosSignal = this._facturaReduxService.totalProductosSignal
  public totalCantidadesSignal = this._facturaReduxService.totalCantidadesSignal
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal



  retirarItem(itemId: number){
    this._facturaReduxService.retirarItem(itemId)
    this.mostrarIcono = null
  }

  actualizarCantidad(cantidad: number, itemId: number,){
    if(cantidad > 0){
      this._facturaReduxService.actualizarCantidadItem(itemId, cantidad)
      this._facturaReduxService.calcularSubtotal(itemId)
    } else {
      this._facturaReduxService.retirarItem(itemId)
    }
  }

  alEntrarMouse(itemId: number, div: HTMLDivElement): void {
    this.mostrarIcono = itemId;
    this.simularClic(div);
  }

  alSalirMouse(): void {
    this.mostrarIcono = null;
  }

  simularClic(elemento: HTMLDivElement): void {
    elemento.click();
  }


}
