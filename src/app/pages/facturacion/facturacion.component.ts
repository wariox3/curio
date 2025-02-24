import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [NgClass],
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

  agregarTab() {
    this.tabs.update((values) => {
      return [
        ...values,
        {
          id: 'Factura' + (this.tabs().length + 1),
          nombre: 'Factura ' + (this.tabs().length + 1),
        },
      ];
    });
  }

  seleccionarTab(index: number) {
    this.tabActivo.set(index);
  }

  cambiarNombreTab(index: number) {
    this.tabs.update((tabs) => {
      return tabs.map((tab, idx) => {
          if (idx === index) {
              return { ...tab, nombre: 'nuevo nombre' };
          }
          return tab;
      });
  });
  }

  removerTab(index: number, event: Event) {
    let tabs = this.tabs().filter((tab, idx) => index !== idx);
    if (this.tabs.length === 0) {
      this.tabActivo.set(0);
    }
    this.tabs.set(tabs)
  }
}
