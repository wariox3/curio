import { CampoDetalle } from '@componentes/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Item } from '@interfaces/item.interface';
import { SiNoPipe } from '@pipe/si-no.pipe';

const siNoPipe = new SiNoPipe();

/**
 * Función para crear los campos del detalle de conductor
 * @param datos Objeto con los datos del conductor
 * @returns Array de campos configurados
 */
export function obtenerCamposItemDetalle(datos: Item): CampoDetalle[] {
  return [
   { clave: 'nombre', etiqueta: 'Nombre' },
   { clave: 'referencia', etiqueta: 'Referencia' },
   { clave: 'precio', etiqueta: 'Precio'  },
   { clave: 'costo', etiqueta: 'Costo' },
   { clave: 'inventario', etiqueta: 'Inventario', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'venta', etiqueta: 'Venta',  formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'compra', etiqueta: 'Compra', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'producto', etiqueta: 'Producto', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'servicio', etiqueta: 'Servicio', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'inventario', etiqueta: 'Inventario', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'existencia', etiqueta: 'Existencia', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'disponible', etiqueta: 'Disponible', formato: (valor: boolean) => siNoPipe.transform(valor) },
   { clave: 'cantidad', etiqueta: 'Cantidad' },
   { clave: 'subtotal', etiqueta: 'Subtotal' },
   { clave: 'favorito', etiqueta: 'Favorito', formato: (valor: boolean) => siNoPipe.transform(valor) },
  ];
}
