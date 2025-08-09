import { ColumnaTabla } from "@interfaces/comun/columnas-lista.interface";
import { SiNoPipe } from '@pipe/si-no.pipe';

const siNoPipe = new SiNoPipe();

export const columnasItemLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'producto', nombre: 'Prod', formato: (valor: boolean) => siNoPipe.transform(valor) },
  { clave: 'servicio', nombre: 'Serv', formato: (valor: boolean) => siNoPipe.transform(valor) },
  { clave: 'codigo', nombre: 'Código' },
  { clave: 'nombre', nombre: 'Nombre' },
  { clave: 'referencia', nombre: 'Referencia' },
  { clave: 'precio', nombre: 'Precio' },
  { clave: 'costo', nombre: 'Costo' },
  { clave: 'existencia', nombre: 'Exi' },
  { clave: 'disponible', nombre: 'Dis' },
  { clave: 'inventario', nombre: 'Inv', formato: (valor: boolean) => siNoPipe.transform(valor) },
  { clave: 'venta', nombre: 'Ven', formato: (valor: boolean) => siNoPipe.transform(valor) },
  { clave: 'favorito', nombre: 'Fav', formato: (valor: boolean) => siNoPipe.transform(valor) },
];
