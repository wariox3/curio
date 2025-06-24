import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';
import { GeneralApiService } from 'src/app/shared/services/general.service';
import { FacturaService } from '../../../services/facutra.service';

@Component({
  selector: 'app-factura-medios-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './factura-medios-exitoso.component.html',
})
export class FacturaMediosExitosoComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  private _generalApiService = inject(GeneralApiService);
  private _facturaService = inject(FacturaService);
  public tabActivo = this._facturaReduxService.facturaTabActivo;

  gestionNuevaFactura() {
    this._facturaReduxService.reiniciarDetalles();
    this._facturaReduxService.retirarFactura(this.tabActivo());
    this._facturaReduxService.seleccionarTabActivoFactura('');

    if (this._facturaReduxService.cantidadFacturasSignal() === 0) {
      this._facturaReduxService.nuevaFactura();
    }
    this._facturaReduxService.seleccionarTabActivoFactura(
      this._facturaReduxService.arrFacturasSignal()[0].uuid,
    );
    this._facturaReduxService.obtenerItemsFactura();
    //this._facturaReduxService.seleccionarTabActivoFactura(this.tabActivo());
  }

  imprimirFactura() {
    this._generalApiService.imprimirDocumento(
      24,
      this._facturaService.detalleId,
    );
    
    this.gestionNuevaFactura();
  }
}
