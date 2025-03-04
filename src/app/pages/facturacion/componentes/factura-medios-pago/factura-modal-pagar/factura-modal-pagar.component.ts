import { NgOption } from './../../../../../../../node_modules/@ng-select/ng-select/lib/ng-select.types.d';
import { Component, inject, OnInit } from '@angular/core';
import { FacturaReduxService } from '../../../services/factura-redux.service';
import { FacturaSeleccionarMedioPagoComponent } from "../factura-seleccionar-medio-pago/factura-seleccionar-medio-pago.component";
import { FacturaMedioPagoEfectivoComponent } from "../factura-medio-pago-efectivo/factura-medio-pago-efectivo.component";
import { FacturaMediosExitosoComponent } from "../factura-medios-exitoso/factura-medios-exitoso.component";

@Component({
  selector: 'app-factura-modal-pagar',
  standalone: true,
  imports: [FacturaSeleccionarMedioPagoComponent, FacturaMedioPagoEfectivoComponent, FacturaMediosExitosoComponent],
  templateUrl: './factura-modal-pagar.component.html',
  styleUrl: './factura-modal-pagar.component.scss'
})
export class FacturaModalPagarComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  public templateActual: string | null = null;
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal;




  mostrarTemplate(metodo: string | null) {
    this.templateActual = metodo;
  }

  pagoExito(){
    this.mostrarTemplate('pagoExitoso')
  }
}
