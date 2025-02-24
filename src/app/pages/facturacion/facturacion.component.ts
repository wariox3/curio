import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FacturaTabsComponent } from "./factura-tabs/factura-tabs.component";

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [NgClass, FacturaTabsComponent],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss',
})
export default class FacturacionComponent {
  tabs = signal([
    {
      id: 'facturacionPrincipal',
      nombre: 'Factura principal',
    },
  ]);
  tabActivo = signal(0);

}
