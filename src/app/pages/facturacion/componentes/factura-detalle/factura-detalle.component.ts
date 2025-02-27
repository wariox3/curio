import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [ContadorCantidadComponent],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  nombre = this._facturaReduxService.facturaActivaNombre;
  productos = [
    {
      id: 1,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 2,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 3,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 4,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 5,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 1,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 2,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 3,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 4,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 5,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 6,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 7,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 8,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 9,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    },
    {
      id: 10,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1
    }
  ];

}
