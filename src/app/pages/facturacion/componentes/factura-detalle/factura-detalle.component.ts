import { DecimalPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContadorCantidadComponent } from '@componentes/contador-cantidad/contador-cantidad.component';
import { Item } from '@interfaces/item.interface';
import { KTDrawer } from '@metronic/components/drawer';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactoApiService } from '../../services/contacto-api.service';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { FacturaEditarItemComponent } from '../factura-editar-item/factura-editar-item.component';
import { FacturaModalPagarComponent } from "../factura-medios-pago/factura-modal-pagar/factura-modal-pagar.component";
import { FacturaOpcionesDropdownComponent } from '../factura-opciones-dropdown/factura-opciones-dropdown.component';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [
    ContadorCantidadComponent,
    DecimalPipe,
    FacturaOpcionesDropdownComponent,
    FormsModule,
    FacturaEditarItemComponent,
    NgSelectModule,
    FacturaModalPagarComponent
],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);
  private _contactoApiService = inject(ContactoApiService);
  public mostrarIcono: number | null = null;
  public nombre = this._facturaReduxService.facturaActivaNombre;
  public items = this._facturaReduxService.arrItemsSignal;
  public totalProductosSignal = this._facturaReduxService.totalProductosSignal;
  public totalCantidadesSignal =
    this._facturaReduxService.totalCantidadesSignal;
  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal;
  public itemSeleccionado: DocumentoFacturaDetalleRespuesta | null = null;
  public arrContactosSignal = this._contactoApiService.arrContactosSignal


  public selectedItem: any;

  @ViewChild('editarItemDrawer')
  editarItemDrawer!: ElementRef;

  ngOnInit(): void {
    this._contactoApiService.lista().subscribe()
  }

  actualizarCliente(contacto: any){
    this._facturaReduxService.actualizarContacto(contacto.id)
  }

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
      this._facturaReduxService.calcularSubtotal(itemId);
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
