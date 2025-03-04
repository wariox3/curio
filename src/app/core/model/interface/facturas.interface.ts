import { Item } from "./item.interface"

export interface Factura {
  id: number,
  nombre: string,
  cliente: number,
  cliente_nombre: string,
  data: {
    itemsAgregados: Item[]
  }
}

export interface FacturaReduxState {
  facturaActiva: number
  facturas: Factura[]
}

