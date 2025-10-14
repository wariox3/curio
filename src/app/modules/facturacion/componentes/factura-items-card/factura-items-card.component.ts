import { DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Item } from '@interfaces/item.interface';
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';
import { map, switchMap, tap } from 'rxjs';
import { TruncatePipe } from '@pipe/truncate.pipe';
import { ItemApiService } from 'src/app/modules/general/services/item.service';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { obtenerClienteFacturaActiva, obtenerContactoPrecioId } from '@redux/selectors/factura.selectors';

@Component({
  selector: 'app-factura-items-card',
  standalone: true,
  imports: [NgClass, DecimalPipe, TruncatePipe],
  templateUrl: './factura-items-card.component.html',
})
export class FacturaItemsCardComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);
  private _itemApiService = inject(ItemApiService);
  private _store = inject(Store);
  public cantidadSignal = signal(0);
  public emirtFavorito = output<number>();
  public digitalOceanUrl = environment.digitalOceanUrl;
  public placeholderImage = '/assets/media/custom/placeholder-image.png';

  @Input() item: Item;
  @Input() contactoPrecioId: number;

  ngOnInit(): void {
    this._itemCantidad(this.item.id);
  }

  seleccionarProducto(item: Item) {
    this._itemApiService
      .detalle(item.id)
      .pipe(
        switchMap((respuesta) => {
          const impuestosFiltrados = this.filtrarImpuestosTipoIVA(respuesta.item.impuestos);
          const itemConImpuestosFiltrados = {
            ...respuesta,
            item: {
              ...respuesta.item,
              impuestos: impuestosFiltrados
            }
          };

          // Si existe contactoPrecioId, consultar el precio específico
          if (this.contactoPrecioId) {
            return this._itemApiService
              .consultarPrecioLista(this.contactoPrecioId, item.id)
              .pipe(
                map((respuestaPrecio) => {
                  // Si vr_precio no es null, actualizar el precio del item
                  if (respuestaPrecio.vr_precio !== null) {
                    return {
                      ...itemConImpuestosFiltrados,
                      item: {
                        ...itemConImpuestosFiltrados.item,
                        precio: respuestaPrecio.vr_precio
                      }
                    };
                  }
                  // Si vr_precio es null, mantener el precio existente
                  return itemConImpuestosFiltrados;
                })
              );
          }
          
          // Si no hay contactoPrecioId, retornar el item con impuestos filtrados
          return [itemConImpuestosFiltrados];
        }),
        tap((respuestaItemDetalle) => {
          if (this.cantidadSignal() === 0) {
            this._agregarProductoAFactura(respuestaItemDetalle.item);
            this._itemCantidad(item.id);
          } else {
            this._agregarNuevaCantidad(respuestaItemDetalle.item);
            this._itemCantidad(item.id);
          }
          this._facturaReduxService.calcularValoresFacturaActivaDetalle(
            item.id,
          );
          this._facturaReduxService.calcularValoresFacturaActivaEncabezado();
        }),
      )
      .subscribe();
  }



  filtrarImpuestosTipoIVA(impuestos: any[]) {
    return impuestos.filter((impuesto) => impuesto.impuesto_impuesto_tipo_id === 1);
  }

  seleccionarFavorito(item: Item) {
    this._itemFavorito(item.id);
    this.emirtFavorito.emit(item.id);
  }

  private _agregarNuevaCantidad(item: Item) {
    this.cantidadSignal.update((cantidad) => (cantidad += 1));
    this._facturaReduxService.actualizarCantidadItem(
      item.id,
      this.cantidadSignal(),
    );
  }

  private _agregarProductoAFactura(item: Item) {
    this._facturaReduxService.agregarItem(item);
  }

  private _itemCantidad(itemId: number) {
    this._facturaReduxService
      .obtenerItemCantidad(itemId)
      .subscribe((cantidad) => {
        this.cantidadSignal.set(cantidad);
        if (this.cantidadSignal() === 0) {
          this.cantidadSignal.set(0);
        }
      });
  }

  private _itemFavorito(itemId: number) {
    this._itemApiService
      .actualizarFavorito(itemId, { favorito: !this.item.favorito })
      .subscribe();
  }
}
