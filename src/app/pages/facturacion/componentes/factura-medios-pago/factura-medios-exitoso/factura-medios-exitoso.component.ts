import { Component, inject } from '@angular/core';
import { KTModal } from '@metronic/components/modal/modal';
import { FacturaReduxService } from '../../../services/factura-redux.service';

@Component({
  selector: 'app-factura-medios-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './factura-medios-exitoso.component.html',
  styleUrl: './factura-medios-exitoso.component.scss'
})
export class FacturaMediosExitosoComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  public tabActivo = this._facturaReduxService.facturaTabActivo;

  gestionNuevaFactura(){
    this._facturaReduxService.retirarFactura(this.tabActivo());
  }

}
