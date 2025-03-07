// factura.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Contacto } from '@interfaces/contacto';
import {
  DocumentoFactura,
  DocumentoFacturaDetalleRespuesta,
  DocumentoImpuestoFacturaRespuesta,
} from '@interfaces/facturas.interface';
import { Item } from '@interfaces/item.interface';
import { Store } from '@ngrx/store';
import {
  actualizarCantidadItemFacturaActiva,
  actualizarClienteFacturaActiva,
  actualizarMetodoPagoFacturaActiva,
  actualizarPlazoPagoFacturaActiva,
  actualizarPrecioItemFacturaActiva,
  actualizarSubtotalFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  actualizarTotalFacturaActiva,
  actualizarTotalItemFacturaActiva,
  agregarItemFacturaActiva,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  retirarDetallesFacturaActiva,
  retirarItemDeFacturaActiva,
  seleccionarFacturaActiva,
} from '@redux/actions/factura.actions';
import {
  obtenerDataFacturaActiva,
  obtenerFacturaActiva,
  obtenerFacturas,
  obtenerItemCantidadFacturaActiva,
  obtenerItemsFacturaActiva,
  obtenerNombreFacturaActiva,
  obtenerClienteFacturaActiva,
  obtenerImpuestosFacturaActiva,
} from '@redux/selectors/factura.selectors';
import {
  documentoFacturaDetalleInit,
  facturaInit,
} from '@constantes/factura.const';
import { FechasService } from 'src/app/shared/services/fechas.service';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  private _store = inject(Store);
  private _fechasService = inject(FechasService);

  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<DocumentoFactura[]>([]);
  public facturaActivaNombre = signal('');
  public facturaActivaContacto = signal<number | null>(1);
  public arrItemsSignal = signal<DocumentoFacturaDetalleRespuesta[]>([]);
  public arrImpuestos = signal<
    Record<string, { impuesto: string | number; total: number }>
  >({});
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
    this.obtenerImpuestoFactura();
    this.obtertenerClienteFactura();
    this.obtenerImpuestoFactura();
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

  obtertenerClienteFactura() {
    this._store.select(obtenerClienteFacturaActiva).subscribe((nombre) => {
      this.facturaActivaContacto.set(nombre);
    });
  }

  obtenerItemsFactura() {
    this._store
      .select(obtenerItemsFacturaActiva)
      .subscribe((items) => this.arrItemsSignal.set(items));
  }

  obtenerDataFactura() {
    return this._store.select(obtenerDataFacturaActiva);
  }

  obtenerImpuestoFactura() {
    this._store
      .select(obtenerImpuestosFacturaActiva)
      .subscribe((impuestos) => this.arrImpuestos.set(impuestos));
  }

  obtenerItemCantidad(itemId: number) {
    return this._store.select(obtenerItemCantidadFacturaActiva(itemId));
  }

  nuevaFactura() {
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();

    this._store.dispatch(
      facturaNuevaAction({
        factura: {
          ...facturaInit,
          nombre: 'Factura',
          fecha: fechaVencimientoInicial,
          fecha_vence: fechaVencimientoInicial,
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

  agregarItem(item: Item) {
    const nuevoItem = this._itemAdapter(item);
    this._store.dispatch(agregarItemFacturaActiva({ item: nuevoItem }));
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
    this._store.dispatch(actualizarPrecioItemFacturaActiva({ itemId, precio }));
  }

  actualizarConctato(contacto: Contacto) {
    this._store.dispatch(actualizarClienteFacturaActiva({ contacto }));
  }

  actualizarMetodoPago(metodoPagoId: number) {
    this._store.dispatch(
      actualizarMetodoPagoFacturaActiva({ metodo_pago_id: metodoPagoId })
    );
  }

  actualizarPlazoPago(plazoPagoId: number) {
    this._store.dispatch(
      actualizarPlazoPagoFacturaActiva({ plazo_pago_id: plazoPagoId })
    );
  }

  calcularValoresFacturaActivaEncabezado() {
    this._calcularSubtotalFactura();
    this._calcularTotalFactura();
  }

  calcularValoresFacturaActivaDetalle(itemId: number) {
    this.calculartotalItem(itemId);
    this.calcularSubtotalItem(itemId);
  }

  reiniciarDetalles() {
    this._store.dispatch(retirarDetallesFacturaActiva());
  }

  private _calcularSubtotalFactura() {
    this._store.dispatch(actualizarSubtotalFacturaActiva());
  }

  private _calcularTotalFactura() {
    this._store.dispatch(actualizarTotalFacturaActiva());
  }

  private calcularSubtotalItem(itemId: number) {
    this._store.dispatch(actualizarSubtotalItemFacturaActiva({ itemId }));
  }

  private calculartotalItem(itemId: number) {
    this._store.dispatch(actualizarTotalItemFacturaActiva({ itemId }));
  }

  private _itemAdapter(item: Item): DocumentoFacturaDetalleRespuesta {
    const impustos = this._adaptarImpuesto(item.impuestos[0]);

    return {
      ...documentoFacturaDetalleInit,
      cantidad: 1,
      item: item.id,
      item_nombre: item.nombre,
      precio: item.precio,
      impuestos: [impustos],
    };
  }

  private _adaptarImpuesto(impuesto: any): DocumentoImpuestoFacturaRespuesta {
    return {
      id: null,
      impuesto: impuesto.impuesto_id,
      porcentaje: impuesto.impuesto_porcentaje,
      total: 0,
      total_operado: 0,
      base: 0,
      nombre: impuesto.impuesto_nombre,
      nombre_extendido: impuesto.impuesto_nombre_extendido,
      porcentaje_base: impuesto.impuesto_porcentaje_base,
      operacion: impuesto.impuesto_operacion,
      venta: false,
      compra: false,
    };
  }
}
