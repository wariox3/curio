import { Component, inject, OnInit } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';
import { ItemApiService } from '../../services/item-api.service';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [ContadorCantidadComponent],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent  {
  private _facturaReduxService = inject(FacturaReduxService);

  public nombre = this._facturaReduxService.facturaActivaNombre;

}
