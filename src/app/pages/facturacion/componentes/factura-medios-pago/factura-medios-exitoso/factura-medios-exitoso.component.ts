import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';

@Component({
  selector: 'app-factura-medios-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './factura-medios-exitoso.component.html',
})
export class FacturaMediosExitosoComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  public tabActivo = this._facturaReduxService.facturaTabActivo;

  gestionNuevaFactura(){
    if(this.tabActivo() === ''){
      this._facturaReduxService.reiniciarDetalles();
    } else {
      this._facturaReduxService.retirarFactura(this.tabActivo());
    }
  }

}
