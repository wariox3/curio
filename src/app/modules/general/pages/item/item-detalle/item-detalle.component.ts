import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CampoDetalle, TablaDetallesComponent } from '@componentes/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Item } from '@interfaces/item.interface';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ItemApiService } from '../../../services/item.service';
import { obtenerCamposItemDetalle } from '../../../mapeo/item-detalle.mapeo';
import { CargarImagenComponent } from '@componentes/ui/cargar-imagen/cargar-imagen.component';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent, CargarImagenComponent],
  templateUrl: './item-detalle.component.html',
})
export default class ItemDetalleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private _activatedRoute = inject(ActivatedRoute);
  private _itemApiService = inject(ItemApiService);
  private _store = inject(Store);
  public digitalOceanUrl = environment.digitalOceanUrl;
  public placeholderImage = 'assets/media/custom/placeholder-image.png';

  public itemSignal = signal<Item>({
    id: 0,
    impuestos: [],
    nombre: '',
    codigo: '',
    referencia: '',
    costo: 0,
    precio: 0,
    base: 0,
    porcentaje: 0,
    total: 0,
    nombre_extendido: '',
    porcentaje_total: 0,
    venta: false,
    compra: false,
    producto: false,
    servicio: false,
    inventario: false,
    existencia: 0,
    disponible: 0,
    cantidad: 0,
    subtotal: 0,
    favorito: false,
    imagen: ''
  });
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposItemDetalle(this.itemSignal());
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._itemApiService.detalle(param.id);
        }),
        tap(detalle => this.itemSignal.set(detalle.item))
      )
      .subscribe();
  }

  recuperarBase64(base64: string) {
    console.log('Base64 recibido:', base64);

    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._itemApiService.cargarImagen(param.id, base64);
        }),
        tap(() => this.consultarInformacion())
      )
      .subscribe();
  }

  eliminarLogo(event: boolean) {
    // this._store
    //   .select(obtenerUsuarioId)
    //   .pipe(
    //     switchMap((codigoUsuario) =>
    //       //this.resumenService.eliminarImagen(codigoUsuario)
    //     ),
    //     tap((respuestaEliminarImagen) => {
    //       if (respuestaEliminarImagen.limpiar) {
    //         this.store.dispatch(
    //           usuarioActionActualizarImagen({
    //             imagen: respuestaEliminarImagen.imagen,
    //           })
    //         );
    //         this.alertaService.mensajaExitoso(
    //           this.translateService.instant(
    //             'FORMULARIOS.MENSAJES.COMUNES.ACTUALIZACION'
    //           )
    //         );
    //       }
    //     })
    //   )
    //   .subscribe();
  }
}
