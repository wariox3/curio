import { Item } from './../../../core/model/interface/item.interface';
// factura.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Factura } from '@interfaces/facturas.interface';
import { Store } from '@ngrx/store';
import {
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  seleccionarFacturaActiva,
  agregarItemFacturaActiva
} from '@redux/actions/factura.actions';
import { obtenerFacturaActiva, obtenerFacturas, obtenerItemsFacturaActiva, obtenerNombreFacturaActiva } from '@redux/selectors/factura.selectors';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<Factura[]>([]);
  public facturaActivaNombre = signal('')
  public arrItemsSignal = signal<Item[]>([])

  private _store = inject(Store);

  constructor() {
    this.obtenerReduxFacturas();
    this.obtertenerTabActivoFactura()
    this.obtertenerNombreFactura()
    this.obtenerItemsFactura()
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

  obtenerItemsFactura(){
    this._store.select(obtenerItemsFacturaActiva).subscribe((items)=> this.arrItemsSignal.set(items))
  }

  nuevaFactura() {
    this._store.dispatch(
      facturaNuevaAction({
        factura: {
          id: 0,
          nombre: 'Factura',
          data: {
            itemsAgregados: []
          },
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

  agregarItem(item: Item){
    this._store.dispatch(agregarItemFacturaActiva({ facturaId: this.facturaTabActivo(), item }));
  }

}
