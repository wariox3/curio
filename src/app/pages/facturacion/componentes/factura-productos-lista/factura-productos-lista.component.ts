import { Component } from '@angular/core';

@Component({
  selector: 'app-factura-productos-lista',
  standalone: true,
  imports: [],
  templateUrl: './factura-productos-lista.component.html',
  styleUrl: './factura-productos-lista.component.css',
})
export class FacturaProductosListaComponent {
  productos = [
    {
      id: 1,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 2,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 3,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 4,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 5,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 1,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 2,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 3,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 4,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 5,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 6,
      nombre: "Pera",
      descripcion: "El rincon de Soto",
      precio: 12.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 7,
      nombre: "Kiwi",
      descripcion: "Zespri",
      precio: 2.34,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 8,
      nombre: "duraznos",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 9,
      nombre: "manzanas",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    },
    {
      id: 10,
      nombre: "Melocotones",
      descripcion: "Natur",
      precio: 3.55,
      cantidad: Math.floor(Math.random() * 10) + 1,
      imagen: "https://random-image-pepebigotes.vercel.app/api/random-image"
    }
  ];
}
