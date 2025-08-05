import { Component, inject, output } from '@angular/core';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-factura-seleccionar-medio-pago',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './factura-seleccionar-medio-pago.component.html',
  styleUrl: './factura-seleccionar-medio-pago.component.scss',
})
export class FacturaSeleccionarMedioPagoComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  public totalGeneralSignal = this._facturaReduxService.totalGeneralSignal;
  public emitirMedio = output<string>();

  selecionarMedio(medio: string) {
    this.emitirMedio.emit(medio);
    let selecionarMedioCodigo = 0;
    let selecionarPlazo = 0;
    switch (medio) {
      default:
        selecionarMedioCodigo = 10;
        selecionarPlazo = 1;
    }
    this._facturaReduxService.actualizarMetodoPago(selecionarMedioCodigo);
    this._facturaReduxService.actualizarPlazoPago(selecionarPlazo);
  }
}
