import { Component, inject } from '@angular/core';
import { FacturaDetalleComponent } from '../factura-detalle/factura-detalle.component';
import { FacturaItemsListaComponent } from '../factura-items-lista/factura-items-lista.component';
import { FacturaTabsComponent } from '../tabs-factura/factura-tabs.component';
import { FacturaBuscarItemComponent } from '../factura-buscar-item/factura-buscar-item.component';
import { FacturaReduxService } from '@redux/services/factura-redux.service';

@Component({
  selector: 'app-base-facturacion',
  standalone: true,
  imports: [
    FacturaTabsComponent,
    FacturaDetalleComponent,
    FacturaItemsListaComponent,
    FacturaBuscarItemComponent,
  ],
  templateUrl: './base-facturacion.component.html',
  styleUrl: './base-facturacion.component.scss',
})
export default class BaseFacturacionComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  constructor() {
    this._facturaReduxService.obtenerReduxFacturas();
    this._facturaReduxService.obtertenerTabActivoFactura();
    this._facturaReduxService.obtenerImpuestoFactura();
    this._facturaReduxService.obtertenerClienteFactura();
    this._facturaReduxService.obtenerImpuestoFactura();
  }
}
