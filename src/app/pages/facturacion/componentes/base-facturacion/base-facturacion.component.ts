import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FacturaTabsComponent } from '../tabs-factura/factura-tabs.component';
import { FacturaDetalleComponent } from "../factura-detalle/factura-detalle.component";
import { FacturaProductosListaComponent } from "../factura-productos-lista/factura-productos-lista.component";

@Component({
  selector: 'app-base-facturacion',
  standalone: true,
  imports: [NgClass, FacturaTabsComponent, FacturaDetalleComponent, FacturaProductosListaComponent],
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
