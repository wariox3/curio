import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  nombre = this._facturaReduxService.facturaActivaNombre;

}
