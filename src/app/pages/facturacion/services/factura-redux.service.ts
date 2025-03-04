// factura.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Factura } from '@interfaces/facturas.interface';
import { Item } from '@interfaces/item.interface';
import { Store } from '@ngrx/store';
import {
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  seleccionarFacturaActiva,
  agregarItemFacturaActiva,
  retirarItemDeFacturaActiva,
  actualizarCantidadItemFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  actualizarPrecioItemFacturaActiva,
} from '@redux/actions/factura.actions';
import {
  obtenerFacturaActiva,
  obtenerFacturas,
  obtenerItemCantidadFacturaActiva,
  obtenerItemsFacturaActiva,
  obtenerNombreFacturaActiva,
} from '@redux/selectors/factura.selectors';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  private _store = inject(Store);

  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<Factura[]>([]);
  public facturaActivaNombre = signal('');
  public arrItemsSignal = signal<Item[]>([]);
  public totalProductosSignal = computed(() => this.arrItemsSignal().length);
  public totalSubtotalSignal = computed(() =>
    this.arrItemsSignal().reduce(
      (acumulador, item) => (acumulador += item.subtotal),
      0
    )
  );
  public totalCantidadesSignal = computed(() =>
    this.arrItemsSignal().reduce(
      (acumulador, item) => (acumulador += item.cantidad),
      0
    )
  );

  constructor() {
    this.obtenerReduxFacturas();
    this.obtertenerTabActivoFactura();
    this.obtertenerNombreFactura();
    this.obtenerItemsFactura();
  }

  obtenerReduxFacturas() {
    this._store
      .select(obtenerFacturas)
      .subscribe((facturas) => this.arrFacturasSignal.set(facturas));
  }

  obtertenerTabActivoFactura() {
    this._store
      .select(obtenerFacturaActiva)
      .subscribe((id) => this.facturaTabActivo.set(id));
  }

  obtertenerNombreFactura() {
    this._store
      .select(obtenerNombreFacturaActiva)
      .subscribe((nombre) => this.facturaActivaNombre.set(nombre));
  }

  obtenerItemsFactura() {
    this._store
      .select(obtenerItemsFacturaActiva)
      .subscribe((items) => this.arrItemsSignal.set(items));
  }

  obtenerItemCantidad(itemId: number) {
    return this._store
      .select(obtenerItemCantidadFacturaActiva(itemId))
  }

  nuevaFactura() {
    this._store.dispatch(
      facturaNuevaAction({
        factura: {
          id: 0,
          nombre: 'Factura',
          data: {
            itemsAgregados: [],
          },
          cliente: 0,
          cliente_nombre: ''
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

  seleccionarTabActivoFactura(id: number) {
    this._store.dispatch(seleccionarFacturaActiva({ id }));
    this.obtertenerTabActivoFactura();
  }

  nuevoItem(item: Item): Item {
    return (item = { ...item, cantidad: 1, subtotal: 0 });
  }

  agregarItem(item: Item) {
    this._store.dispatch(
      agregarItemFacturaActiva({ item: this.nuevoItem(item) })
    );
  }

  retirarItem(itemId: number) {
    this._store.dispatch(retirarItemDeFacturaActiva({ itemId }));
  }

  actualizarCantidadItem(itemId: number, cantidad: number) {
    this._store.dispatch(
      actualizarCantidadItemFacturaActiva({ itemId, cantidad })
    );
  }

  actualizarPrecioItem(itemId: number, precio: number) {
    this._store.dispatch(
      actualizarPrecioItemFacturaActiva({ itemId, precio })
    );
  }



  calcularSubtotal(itemId: number) {
    this._store.dispatch(actualizarSubtotalItemFacturaActiva({ itemId }));
  }
}
