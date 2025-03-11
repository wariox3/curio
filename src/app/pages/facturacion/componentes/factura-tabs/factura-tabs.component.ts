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
import { FacturaOpcionesDropdownComponent } from "../factura-opciones-dropdown/factura-opciones-dropdown.component";

@Component({
  selector: 'app-factura-tabs',
  standalone: true,
  imports: [NgClass, FacturaOpcionesDropdownComponent],
  templateUrl: './factura-tabs.component.html',
})
export class FacturaTabsComponent {
  private _facturaReduxService = inject(FacturaReduxService);

  tabs = this._facturaReduxService.arrFacturasSignal;
  tabActivo = this._facturaReduxService.facturaTabActivo;

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

}
