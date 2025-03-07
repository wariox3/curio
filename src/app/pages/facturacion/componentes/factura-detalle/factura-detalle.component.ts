import { CurrencyPipe, DecimalPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeleccionarClienteComponent } from "@componentes/form/seleccionar-cliente/seleccionar-cliente.component";
import { ContadorCantidadComponent } from '@componentes/ui/contador-cantidad/contador-cantidad.component';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { KTDrawer } from '@metronic/components/drawer';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { FacturaEditarItemComponent } from '../factura-editar-item/factura-editar-item.component';
import { FacturaModalPagarComponent } from "../factura-medios-pago/factura-modal-pagar/factura-modal-pagar.component";
import { FacturaOpcionesDropdownComponent } from '../factura-opciones-dropdown/factura-opciones-dropdown.component';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [
    ContadorCantidadComponent,
    DecimalPipe,
    FacturaOpcionesDropdownComponent,
    FormsModule,
    FacturaEditarItemComponent,
    FacturaModalPagarComponent,
    SeleccionarClienteComponent,
    JsonPipe,
    KeyValuePipe,
    CurrencyPipe
],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  public mostrarIcono: number | null = null;
  public nombre = this._facturaReduxService.facturaActivaNombre;
  public items = this._facturaReduxService.arrItemsSignal;
  public arrImpuestos = this._facturaReduxService.arrImpuestos
  public totalProductosSignal = this._facturaReduxService.totalProductosSignal;
  public totalCantidadesSignal =
    this._facturaReduxService.totalCantidadesSignal;
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal;
  public itemSeleccionado: DocumentoFacturaDetalleRespuesta | null = null;
  @ViewChild('editarItemDrawer')
  editarItemDrawer!: ElementRef;

  editarItem() {
    this.drawerClose();
  }

  retirarItem(itemId: number) {
    this._facturaReduxService.retirarItem(itemId);
    this.mostrarIcono = null;
  }

  actualizarCantidad(cantidad: number, itemId: number) {
    if (cantidad > 0) {
      this._facturaReduxService.actualizarCantidadItem(itemId, cantidad);
      this._facturaReduxService.calcularValoresFacturaActivaDetalle(itemId);
    } else {
      this._facturaReduxService.retirarItem(itemId);
    }
  }

  alEntrarMouse(item: DocumentoFacturaDetalleRespuesta, div: HTMLDivElement): void {
    this.mostrarIcono = item.item;
    this.itemSeleccionado = item;
    this.simularClic(div);
  }

  alSalirMouse(): void {
    this.mostrarIcono = null;
  }

  simularClic(elemento: HTMLDivElement): void {
    elemento.click();
  }

  drawerClose() {
    const drawer = KTDrawer.getInstance(this.editarItemDrawer.nativeElement);
    if (drawer.isOpen) {
      drawer.toggle();
    }
  }
}
