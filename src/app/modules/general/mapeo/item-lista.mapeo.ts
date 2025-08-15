import { ColumnaTabla } from '@interfaces/comun/columnas-lista.interface';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { formatearMonedaCOP } from 'src/app/shared/utils/formatters';

const siNoPipe = new SiNoPipe();

export const columnasItemLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  {
    clave: 'producto',
    nombre: 'Prod',
    formato: (valor: boolean) => siNoPipe.transform(valor),
  },
  {
    clave: 'servicio',
    nombre: 'Serv',
    formato: (valor: boolean) => siNoPipe.transform(valor),
  },
  { clave: 'codigo', nombre: 'Código' },
  { clave: 'nombre', nombre: 'Nombre' },
  { clave: 'referencia', nombre: 'Referencia' },
  { clave: 'precio', nombre: 'Precio', alineacion: 'derecha', formato: (valor: number) => formatearMonedaCOP(valor) },
  { clave: 'existencia', nombre: 'Exi' , alineacion: 'derecha' },
  { clave: 'disponible', nombre: 'Dis' , alineacion: 'derecha' },
  {
    clave: 'inventario',
    nombre: 'Inv',
    formato: (valor: boolean) => siNoPipe.transform(valor),
  },
  {
    clave: 'venta',
    nombre: 'Ven',
    formato: (valor: boolean) => siNoPipe.transform(valor),
  },
  {
    clave: 'favorito',
    nombre: 'Fav',
    formato: (valor: boolean) => siNoPipe.transform(valor),
  },
];
