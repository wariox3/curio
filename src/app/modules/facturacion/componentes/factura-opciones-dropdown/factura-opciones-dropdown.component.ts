import {
  Component,
  ElementRef,
  inject,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KTDropdown } from '@metronic/components/dropdown/dropdown';
import { KTModal } from '@metronic/components/modal/modal';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';

@Component({
  selector: 'app-factura-opciones-dropdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './factura-opciones-dropdown.component.html',
  styleUrl: './factura-opciones-dropdown.component.scss',
})
export class FacturaOpcionesDropdownComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  public tabs = this._facturaReduxService.arrFacturasSignal;
  public tabActivo = this._facturaReduxService.facturaTabActivo;
  public inputCambiarNombre: string = '';
  public nombre = this._facturaReduxService.facturaActivaNombre;

  @Input() visualizarBtnImprimir: boolean = true;
  @ViewChild('modalCambiarNombreTab') modalCambiarNombreTab!: ElementRef;
  @ViewChild('modalConfirmacionEliminar')
  modalConfirmacionEliminar!: ElementRef;
  @ViewChildren('dropdownTab') dropdownTab!: QueryList<ElementRef>;

  cambiarNombreTab(): void {
    this.inputCambiarNombre = '';
    this._cerrarDropdowns();
    this._toggleModal(this.modalCambiarNombreTab);
  }

  removerTab(): void {
    this._cerrarDropdowns();
    this._toggleModal(this.modalConfirmacionEliminar);
  }

  actualizarNombreTab(): void {
    this._facturaReduxService.cambiarNombre(
      this.tabActivo(),
      this.inputCambiarNombre,
    );
  }

  private _cerrarDropdowns(): void {
    this.dropdownTab.forEach((item) => {
      KTDropdown.getInstance(item.nativeElement)?.hide();
    });
  }

  private _toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }

  retirarFactura() {
    // Guardamos el índice de la tab activa
    const tabActivaActual = this.tabActivo();
    
    // Obtenemos todas las facturas antes de eliminar
    const facturasActuales = this._facturaReduxService.arrFacturasSignal();
    
    // Encontramos el índice de la factura actual en el array
    const indiceActual = facturasActuales.findIndex(f => f.uuid === tabActivaActual);
    
    // Eliminamos la factura
    this._facturaReduxService.retirarFactura(tabActivaActual);
    this._facturaReduxService.obtenerReduxFacturas();
    
    // Cerramos el modal
    this._toggleModal(this.modalConfirmacionEliminar);
    
    // Seleccionamos la siguiente tab disponible después de un pequeño delay
    // para asegurar que el estado de Redux se ha actualizado
    setTimeout(() => {
      const facturasRestantes = this._facturaReduxService.arrFacturasSignal();
      
      if (facturasRestantes.length > 0) {
        // Si hay facturas restantes, seleccionamos la siguiente o la anterior
        let nuevaTabIndex = indiceActual;
        
        // Si estábamos en la última tab, seleccionamos la anterior
        if (nuevaTabIndex >= facturasRestantes.length) {
          nuevaTabIndex = facturasRestantes.length - 1;
        }
        
        // Seleccionamos la nueva tab
        const nuevaTabId = facturasRestantes[nuevaTabIndex].uuid;
        this._facturaReduxService.seleccionarTabActivoFactura(nuevaTabId);
      } else {
        // Si no quedan facturas, podríamos crear una nueva automáticamente
        // o simplemente dejar que la UI muestre el estado vacío
        // Opcional: this._facturaReduxService.nuevaFactura();
      }
    }, 100);
  }
}
