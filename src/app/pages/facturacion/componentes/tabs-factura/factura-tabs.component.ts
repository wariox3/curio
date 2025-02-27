import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { KTDropdown } from '@metronic/components/dropdown/dropdown';
import { KTModal } from '@metronic/components/modal/modal';

@Component({
  selector: 'app-factura-tabs',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './factura-tabs.component.html',
})
export class FacturaTabsComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  tabs = this._facturaReduxService.arrFacturasSignal;
  tabActivo = this._facturaReduxService.facturaTabActivo;
  inputCambiarNombre: string = '';

  @ViewChild('modalCambiarNombreTab') modalCambiarNombreTab!: ElementRef;
  @ViewChild('modalConfirmacionEliminar')
  modalConfirmacionEliminar!: ElementRef;
  @ViewChildren('dropdownTab') dropdownTab!: QueryList<ElementRef>;

  agregarTab() {
    this._facturaReduxService.nuevaFactura();
  }

  seleccionarTab(index: number) {
    this._facturaReduxService.seleccionarTabActivoFactura(index)
  }

  cambiarNombreTab(): void {
    this.inputCambiarNombre = '';
    this.cerrarDropdowns();
    this.toggleModal(this.modalCambiarNombreTab);
  }

  removerTab(): void {
    this.cerrarDropdowns();
    this.toggleModal(this.modalConfirmacionEliminar);
  }

  actualizarNombreTab(): void {
    this._facturaReduxService.cambiarNombre(
      this.tabActivo(),
      this.inputCambiarNombre
    );
  }

  retirarFactura() {
    this._facturaReduxService.retirarFactura(this.tabActivo())

  }

  private cerrarDropdowns(): void {
    this.dropdownTab.forEach((item) => {
      KTDropdown.getInstance(item.nativeElement)?.hide();
    });
  }

  private toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }
}
