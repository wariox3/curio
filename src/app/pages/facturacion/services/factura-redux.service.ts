// factura.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Factura } from '@interfaces/facturas.interface';
import { Store } from '@ngrx/store';
import {
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  seleccionarFacturaActiva,
} from '@redux/actions/factura.actions';
import { obtenerFacturaActiva, obtenerFacturas, obtenerNombreFacturaActiva } from '@redux/selectors/factura.selectors';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<Factura[]>([]);
  public facturaActivaNombre = signal('')

  private _store = inject(Store);

  constructor() {
    this.obtenerReduxFacturas();
    this.obtertenerTabActivoFactura()
    this.obtertenerNombreFactura()
  }

  obtenerReduxFacturas() {
    this._store
      .select(obtenerFacturas)
      .subscribe((facturas) => this.arrFacturasSignal.set(facturas));
  }

  obtertenerTabActivoFactura(){
    this._store.select(obtenerFacturaActiva).subscribe((id)=> this.facturaTabActivo.set(id))
  }

  obtertenerNombreFactura(){
    this._store.select(obtenerNombreFacturaActiva).subscribe((nombre)=> this.facturaActivaNombre.set(nombre))
  }

  nuevaFactura() {
    this._store.dispatch(
      facturaNuevaAction({
        factura: {
          id: 0,
          nombre: 'Factura',
          data: {},
        },
      })
    );
    this.obtenerReduxFacturas();
  }

  cambiarNombre(index: number, nombre: string) {
    this._store.dispatch(
      facturaActualizarNombreAction({
        index,
        nombre,
      })
    );
    this.obtenerReduxFacturas();
  }

  retirarFactura(index: number) {
    this._store.dispatch(facturaEliminarAction({ index }));
    this.obtenerReduxFacturas();
  }

  seleccionarTabActivoFactura(id: number){
    this._store.dispatch(seleccionarFacturaActiva({id}));
    this.obtertenerTabActivoFactura();
  }
}
