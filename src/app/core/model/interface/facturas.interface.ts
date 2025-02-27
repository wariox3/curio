export interface Factura {
  id: number,
  nombre: string,
  data: {}
}

export interface FacturaReduxState {
  facturaActiva: number
  facturas: Factura[]
}

