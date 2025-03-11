import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FacturaTabsComponent } from '../factura-tabs/factura-tabs.component';
import { FacturaDetalleComponent } from "../factura-detalle/factura-detalle.component";
import { FacturaItemsListaComponent } from "../factura-items-lista/factura-items-lista.component";

@Component({
  selector: 'app-base-facturacion',
  standalone: true,
  imports: [NgClass, FacturaTabsComponent, FacturaDetalleComponent, FacturaItemsListaComponent],
  templateUrl: './base-facturacion.component.html',
  styleUrl: './base-facturacion.component.scss',
})
export default class BaseFacturacionComponent {
  tabs = signal([
    {
      id: 'facturacionPrincipal',
      nombre: 'Factura principal',
    },
  ]);
  tabActivo = signal(0);
}
