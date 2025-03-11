import { Component } from '@angular/core';
import { FacturaDetalleComponent } from "../factura-detalle/factura-detalle.component";
import { FacturaItemsListaComponent } from "../factura-items-lista/factura-items-lista.component";
import { FacturaTabsComponent } from '../factura-tabs/factura-tabs.component';

@Component({
  selector: 'app-base-facturacion',
  standalone: true,
  imports: [FacturaTabsComponent, FacturaDetalleComponent, FacturaItemsListaComponent],
  templateUrl: './base-facturacion.component.html',
  styleUrl: './base-facturacion.component.scss',
})
export default class BaseFacturacionComponent {

}
