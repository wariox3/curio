import { FormsModule } from '@angular/forms';
import { KTDropdown } from './../../../../metronic/core/components/dropdown/dropdown';
import { KTModal } from './../../../../metronic/core/components/modal/';
import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  viewChildren,
} from '@angular/core';

@Component({
  selector: 'app-factura-tabs',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './factura-tabs.component.html',
})
export class FacturaTabsComponent {
  tabs = signal([
    {
      id: 'facturacionPrincipal',
      nombre: 'Factura principal',
    },
  ]);
  tabActivo = signal(0);
  inputCambiarNombre: string = 'asd';

  @ViewChild('modalCambiarNombreTab') modalCambiarNombreTab!: ElementRef;
  @ViewChild('modalConfirmacionEliminar')
  modalConfirmacionEliminar!: ElementRef;
  @ViewChildren('dropdownTab') dropdownTab!: QueryList<ElementRef>;

  agregarTab() {
    this.tabs.update((values) => {
      return [
        ...values,
        {
          id: 'Factura' + (this.tabs().length + 1),
          nombre: 'Factura ' + (this.tabs().length + 1),
        },
      ];
    });
  }

  seleccionarTab(index: number) {
    this.tabActivo.set(index);
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
    this.tabs.update((tabs) =>
      tabs.map((tab, idx) =>
        idx === this.tabActivo()
          ? { ...tab, nombre: this.inputCambiarNombre }
          : tab
      )
    );
  }

  retirarFactura() {
    let tabs = this.tabs().filter((tab, idx) => this.tabActivo() !== idx);
    if (this.tabs.length === 0) {
      this.tabActivo.set(0);
    }
    this.tabs.set(tabs);
  }

  private cerrarDropdowns(): void {
    this.dropdownTab.forEach((item) =>
      KTDropdown.getInstance(item.nativeElement)?.hide()
    );
  }

  private toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }
}
