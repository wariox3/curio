import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';
import { FacturaMedioPagoEfectivoComponent } from '../factura-medio-pago-efectivo/factura-medio-pago-efectivo.component';
import { FacturaMediosExitosoComponent } from '../factura-medios-exitoso/factura-medios-exitoso.component';
import { FacturaSeleccionarMedioPagoComponent } from '../factura-seleccionar-medio-pago/factura-seleccionar-medio-pago.component';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';

@Component({
  selector: 'app-factura-modal-pagar',
  standalone: true,
  imports: [
    FacturaSeleccionarMedioPagoComponent,
    FacturaMedioPagoEfectivoComponent,
    FacturaMediosExitosoComponent,
    NgClass,
  ],
  templateUrl: './factura-modal-pagar.component.html',
  styleUrl: './factura-modal-pagar.component.scss',
})
export class FacturaModalPagarComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  private _ConfiguracionReduxService = inject(
    ConfiguracionReduxService,
  );

  public templateActual: string | null = null;
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal;
  public totalProductosSignal = this._facturaReduxService.totalProductosSignal;
  public documentoTipo =
    this._ConfiguracionReduxService.obtenerDocumentoTipoId();

  mostrarTemplate(metodo: string | null) {
    this.templateActual = metodo;
  }

  pagoExito() {
    this.mostrarTemplate('pagoExitoso');
  }
}
