import { Component } from '@angular/core';
import { FacturaDetalleComponent } from "../factura-detalle/factura-detalle.component";
import { FacturaItemsListaComponent } from "../factura-items-lista/factura-items-lista.component";
import { FacturaTabsComponent } from '../tabs-factura/factura-tabs.component';
import { FacturaBuscarItemComponent } from "../factura-buscar-item/factura-buscar-item.component";

@Component({
  selector: 'app-base-facturacion',
  standalone: true,
  imports: [FacturaTabsComponent, FacturaDetalleComponent, FacturaItemsListaComponent, FacturaBuscarItemComponent],
  templateUrl: './base-facturacion.component.html',
  styleUrl: './base-facturacion.component.scss',
})
export default class BaseFacturacionComponent {

}
