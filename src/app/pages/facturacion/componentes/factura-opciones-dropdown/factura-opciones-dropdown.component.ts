import {
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KTDropdown } from '@metronic/components/dropdown/dropdown';
import { KTModal } from '@metronic/components/modal/modal';
import { FacturaReduxService } from '../../services/factura-redux.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { EMPTY, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-factura-opciones-dropdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './factura-opciones-dropdown.component.html',
  styleUrl: './factura-opciones-dropdown.component.scss',
})
export class FacturaOpcionesDropdownComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  private _alertaService = inject(AlertaService);
  public tabs = this._facturaReduxService.arrFacturasSignal;
  public tabActivo = this._facturaReduxService.facturaTabActivo;
  public inputCambiarNombre: string = '';
  public nombre = this._facturaReduxService.facturaActivaNombre;

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
      this.inputCambiarNombre
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
    this._facturaReduxService.retirarFactura(this.tabActivo());
    this._toggleModal(this.modalConfirmacionEliminar);
  }

  retriarItemsDetalle() {
    this._alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            this._facturaReduxService.reiniciarDetalles()
            return of(true);
          }
          return EMPTY;
        })
      )
      .subscribe();
    this._cerrarDropdowns();
  }
}
