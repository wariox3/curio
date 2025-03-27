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
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';
import { FacturaOpcionesDropdownComponent } from "../factura-opciones-dropdown/factura-opciones-dropdown.component";

@Component({
  selector: 'app-factura-tabs',
  standalone: true,
  imports: [NgClass, FacturaOpcionesDropdownComponent],
  templateUrl: './factura-tabs.component.html',
})
export class FacturaTabsComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);

  arrFacturasSignal = this._facturaReduxService.arrFacturasSignal;
  tabActivo = this._facturaReduxService.facturaTabActivo;

  @ViewChild('modalCambiarNombreTab') modalCambiarNombreTab!: ElementRef;
  @ViewChild('modalConfirmacionEliminar')
  modalConfirmacionEliminar!: ElementRef;
  @ViewChildren('dropdownTab') dropdownTab!: QueryList<ElementRef>;

  ngOnInit(): void {
    this._facturaReduxService.obtenerReduxFacturas()
    if(this.arrFacturasSignal().length === 0){
      this.agregarTab()
    }
    this.seleccionarTab(0)
    this._facturaReduxService.obtenerNombreFactura();
    this._facturaReduxService.obtenerItemsFactura();
  }

  agregarTab() {
    this._facturaReduxService.nuevaFactura();
    this._facturaReduxService.obtenerNombreFactura();
    this._facturaReduxService.obtenerItemsFactura();
  }

  seleccionarTab(index: number) {
    this._facturaReduxService.seleccionarTabActivoFactura(this._facturaReduxService.arrFacturasSignal()[index].uuid)
  }

}
