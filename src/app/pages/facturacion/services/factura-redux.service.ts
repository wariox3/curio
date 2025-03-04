// factura.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { DocumentoFactura, DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { Item } from '@interfaces/item.interface';
import { Store } from '@ngrx/store';
import {
  actualizarCantidadItemFacturaActiva,
  actualizarClienteFacturaActiva,
  actualizarNombreClienteFacturaActiva,
  actualizarPrecioItemFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  agregarItemFacturaActiva,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  retirarItemDeFacturaActiva,
  seleccionarFacturaActiva,
} from '@redux/actions/factura.actions';
import {
  obtenerFacturaActiva,
  obtenerFacturas,
  obtenerItemCantidadFacturaActiva,
  obtenerItemsFacturaActiva,
  obtenerNombreFacturaActiva
} from '@redux/selectors/factura.selectors';
import { documentoFacturaDetalleInit, facturaInit } from 'src/app/core/model/constantes/factura';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  private _store = inject(Store);

  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<DocumentoFactura[]>([]);
  public facturaActivaNombre = signal('');
  public arrItemsSignal = signal<DocumentoFacturaDetalleRespuesta[]>([]);
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
          ...facturaInit,
          nombre: 'Factura',
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

  nuevoItem() {
    return documentoFacturaDetalleInit;
  }

  agregarItem() {
    this._store.dispatch(
      agregarItemFacturaActiva({ item: this.nuevoItem() })
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

  actualizarContactoId(clienteId: number){
    this._store.dispatch(
      actualizarClienteFacturaActiva({clienteId})
    )
  }

  actualizarContactoNombre(cliente_nombre: string){
    this._store.dispatch(
      actualizarNombreClienteFacturaActiva({cliente_nombre})
    )
  }

  calcularSubtotal(itemId: number) {
    this._store.dispatch(actualizarSubtotalItemFacturaActiva({ itemId }));
  }
}
