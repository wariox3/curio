import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalStandardComponent } from '@componentes/ui/modal/modal-standard.component';
import { ModalService } from '@componentes/ui/modal/modal.service';
import { Item } from '@interfaces/item.interface';
import { KTModal } from '@metronic/components/modal';
import { FacturaReduxService } from '@redux/services/factura-redux.service';
import { FacturaTiposBusqueda } from '@type/factura-tipos-busqueda.type';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { ItemApiService } from 'src/app/modules/general/services/item.service';
import { ItemModalComponent } from 'src/app/modules/item/components/item-modal/item-modal.component';

@Component({
  selector: 'app-factura-buscar-item',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ItemModalComponent,
    ModalStandardComponent,
    AsyncPipe,
  ],
  templateUrl: './factura-buscar-item.component.html',
  styleUrl: './factura-buscar-item.component.scss',
})
export class FacturaBuscarItemComponent {
  private _itemApi = inject(ItemApiService);
  private _facturaReduxService = inject(FacturaReduxService);
  private _modalService = inject(ModalService);

  public tipoBusqueda = signal<FacturaTiposBusqueda>('nombre');
  public inputBusqueda: string | null = null;
  @ViewChild('campoBusqueda') campoBusqueda: ElementRef;
  inputNombre: ElementRef<HTMLInputElement>;
  @ViewChild('modalFormulario') modalFormulario!: ElementRef;

  seleccionarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this._actualizarTipoBusqueda(tipoBusqueda);
    this.campoBusqueda.nativeElement.focus();
  }

  buscarCampo() {
    if (this._debeBuscarPorNombre()) {
      this._buscarPorNombre();
    } else if (this._debeBuscarPorCodigo()) {
      this._buscarPorCodigo();
    } else {
      this._obtenerListaCompleta();
    }
  }

  itemSubmitted(item: Item) {
    this._obtenerListaCompleta();
  }

  limpiarBusqueda() {
    this.inputBusqueda = null;
    this._itemApi.lista().subscribe();
  }

  gestionarRegistro() {
    this._toggleModal(this.modalFormulario);
    this._obtenerListaCompleta();
  }

  private _actualizarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this.tipoBusqueda.update(() => tipoBusqueda);
  }

  private _obtenerListaCompleta() {
    this._itemApi.lista().subscribe();
  }

  private _buscarPorNombre() {
    this._itemApi
      .busqueda(this.inputBusqueda, {
        nombre__icontains: this.inputBusqueda,
      })
      .subscribe();
  }

  filtrarImpuestosTipoIVA(impuestos: any[]) {
    return impuestos.filter((impuesto) => impuesto.impuesto_impuesto_tipo_id === 1);
  }

  private _buscarPorCodigo() {
    this._itemApi
      .busqueda(this.inputBusqueda, {
        codigo: this.inputBusqueda,
      })
      .pipe(
        switchMap((items: any) => {
          if (items.count === 1) {
            return this._itemApi.detalle(items.results[0].id).pipe(
              map((respuestaDetalle) => {
                const impuestosFiltrados = this.filtrarImpuestosTipoIVA(respuestaDetalle.item.impuestos);
                return {
                  ...respuestaDetalle,
                  item: {
                    ...respuestaDetalle.item,
                    impuestos: impuestosFiltrados
                  }
                }
              })
            )
          }
          return of(null);
        }),
        switchMap((respuestaDetalle) => {
          if (!respuestaDetalle) return of(null);
          return this._facturaReduxService
            .validarItemAgregadoFactura(respuestaDetalle.item.id)
            .pipe(
              map((respuestaValidacion) => ({
                respuestaDetalle,
                respuestaValidacion,
              })),
            );
        }),
        take(1),
        tap((resultado) => {
          if (!resultado) return;
          const { respuestaDetalle, respuestaValidacion } = resultado;
          if (respuestaValidacion) {
            const cantidadActual = respuestaValidacion.cantidad;
            const nuevaCantidad = cantidadActual + 1;
            this._facturaReduxService.actualizarCantidadItem(
              respuestaValidacion.item,
              nuevaCantidad,
            );
          } else {
            this._facturaReduxService.agregarItem(respuestaDetalle.item);
          }
          this._facturaReduxService.calcularValoresFacturaActivaDetalle(
            respuestaDetalle.item.id,
          );
          this._facturaReduxService.calcularValoresFacturaActivaEncabezado();
        }),
      )
      .subscribe();
  }

  abrirModal(id: string) {
    this._modalService.open(id);
  }

  getModalInstaceState(id: string): Observable<boolean> {
    return this._modalService.isOpen$(id);
  }

  private _debeBuscarPorNombre(): boolean {
    return this.tipoBusqueda() === 'nombre' && this.inputBusqueda !== '';
  }

  private _debeBuscarPorCodigo(): boolean {
    return this.tipoBusqueda() === 'codigo' && this.inputBusqueda !== '';
  }

  private _toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }
}
