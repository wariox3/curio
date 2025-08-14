import { Component, inject, signal } from '@angular/core';
import { FacturaDetalleComponent } from '../factura-detalle/factura-detalle.component';
import { FacturaItemsListaComponent } from '../factura-items-lista/factura-items-lista.component';
import { FacturaBuscarItemComponent } from '../factura-buscar-item/factura-buscar-item.component';
import { FacturaReduxService } from '@redux/services/factura-redux.service';
import { FacturaTabsComponent } from '../factura-tabs/factura-tabs.component';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-facturacion-base',
  standalone: true,
  imports: [
    FacturaTabsComponent,
    FacturaDetalleComponent,
    FacturaItemsListaComponent,
    FacturaBuscarItemComponent,
    RouterLink,
  ],
  templateUrl: './facturacion-base.component.html',
  styleUrl: './facturacion-base.component.scss',
})
export default class FacturacionBaseComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  private _configuracionReduxService = inject(ConfiguracionReduxService);
  
  public tieneDocumentoTipo = signal(false);

  constructor() {
    this._facturaReduxService.obtenerReduxFacturas();
    this._facturaReduxService.obtertenerTabActivoFactura();
    this._facturaReduxService.obtertenerClienteFactura();
    this._facturaReduxService.obtenerImpuestoFactura();
    this._verificarDocumentoTipo();
    
    if(this._configuracionReduxService.obtenerContenedorId() === 0){
      this._configuracionReduxService.validarConfiguracion()
    }
  }
  
  private _verificarDocumentoTipo(): void {
    const documentoTipoId = this._configuracionReduxService.obtenerDocumentoTipoId();
    this.tieneDocumentoTipo.set(!!documentoTipoId);
  }
}
