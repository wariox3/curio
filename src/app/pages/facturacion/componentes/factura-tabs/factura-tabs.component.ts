import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { FacturaOpcionesDropdownComponent } from "../factura-opciones-dropdown/factura-opciones-dropdown.component";

@Component({
  selector: 'app-factura-tabs',
  standalone: true,
  imports: [NgClass, FacturaOpcionesDropdownComponent],
  templateUrl: './factura-tabs.component.html',
})
export class FacturaTabsComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);

  tabs = this._facturaReduxService.arrFacturasSignal;
  tabActivo = this._facturaReduxService.facturaTabActivo;

  @ViewChild('modalCambiarNombreTab') modalCambiarNombreTab!: ElementRef;
  @ViewChild('modalConfirmacionEliminar')
  modalConfirmacionEliminar!: ElementRef;
  @ViewChildren('dropdownTab') dropdownTab!: QueryList<ElementRef>;

  ngOnInit(): void {
    this._facturaReduxService.obtenerReduxFacturas()
    if(this.tabs().length === 0){
      this.agregarTab()
    }

  }

  agregarTab() {
    this._facturaReduxService.nuevaFactura();
  }

  seleccionarTab(index: number) {
    this._facturaReduxService.seleccionarTabActivoFactura(index)
  }

}
