import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaReduxService } from '@redux/services/factura-redux.service';
import { FacturaTiposBusqueda } from '@type/factura-tipos-busqueda.type';
import { map, of, switchMap, take, tap } from 'rxjs';
import { ItemApiService } from '../../services/item-api.service';

@Component({
  selector: 'app-factura-buscar-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './factura-buscar-item.component.html',
  styleUrl: './factura-buscar-item.component.scss',
})
export class FacturaBuscarItemComponent {
  private _itemApi = inject(ItemApiService);
  private _facturaReduxService = inject(FacturaReduxService);
  public tipoBusqueda = signal<FacturaTiposBusqueda>('nombre');
  public inputBusqueda: string | null = null;
  @ViewChild('campoBusqueda') campoBusqueda: ElementRef;

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

  limpiarBusqueda() {
    this.inputBusqueda = null;
    this._itemApi.lista().subscribe();
  }

  private _actualizarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this.tipoBusqueda.update(() => tipoBusqueda);
  }

  private _obtenerListaCompleta() {
    this._itemApi.lista().subscribe();
  }

  private _buscarPorNombre() {
    this._itemApi
      .busqueda(this.inputBusqueda, [
        {
          propiedad: 'nombre',
          valor1: this.inputBusqueda,
          operador: 'icontains',
        },
      ])
      .subscribe();
  }

  private _buscarPorCodigo() {
    this._itemApi
      .busqueda(this.inputBusqueda, [
        {
          propiedad: 'codigo',
          valor1: this.inputBusqueda,
          operador: 'exact',
        },
      ])
      .pipe(
        switchMap((items) => {
          if (items.cantidad_registros === 1) {
            return this._itemApi.detalle(items.registros[0].id);
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
              }))
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
              nuevaCantidad
            );
          } else {
            this._facturaReduxService.agregarItem(respuestaDetalle.item);
          }
          this._facturaReduxService.calcularValoresFacturaActivaDetalle(
            respuestaDetalle.item.id
          );
          this._facturaReduxService.calcularValoresFacturaActivaEncabezado();
        })
      )
      .subscribe();
  }

  private _debeBuscarPorNombre(): boolean {
    return this.tipoBusqueda() === 'nombre' && this.inputBusqueda !== '';
  }

  private _debeBuscarPorCodigo(): boolean {
    return this.tipoBusqueda() === 'codigo' && this.inputBusqueda !== '';
  }
}
