import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ItemFormularioComponent from 'src/app/modules/general/pages/item/item-formulario/item-formulario.component';
import { takeUntil, tap } from 'rxjs/operators';
import { ItemApiService } from 'src/app/modules/general/services/item.service';
import { Subject } from 'rxjs';
import { Item } from 'src/app/modules/general/interface/item.interface';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ItemFormularioComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export default class ItemComponent {
  @ViewChild('itemFormulario') itemFormulario!: ItemFormularioComponent;
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _itemService = inject(ItemApiService);
  private _destroy$ = new Subject<void>();
  private _alertaService = inject(AlertaService);

  public itemId: string | null = null;
  public item = signal<Item | null>(null);

  ngOnInit() {
    this._obtenerId();
    this._consultarDetalle(this.itemId);
  }

  private _consultarDetalle(id: string | null) {
    if (!id) return;

    this._itemService.detalle(+id).subscribe((respuesta) => {
      this.item.set(respuesta.item);
    });
  }

  private _obtenerId() {
    this._activatedRoute.params.subscribe((params: any) => {
      this.itemId = params.id;
    });
  }

  enviarFormulario() {
    this.itemFormulario?.enviarFormulario();
  }

  irAtras() {
    this._router.navigate(['/administracion/item/lista']);
  }

  guardarItem(item: any) {
    if (this.itemId) {
      this._itemService
        .editarItem(item, +this.itemId)
        .pipe(
          takeUntil(this._destroy$),
          tap(() => {
            this._alertaService.mensajaExitoso(
              'Item editado con exito',
              ``,
            );
            this.irAtras();
          }),
        )
        .subscribe();
    } else {
      this._itemService
        .guardarItem(item)
        .pipe(
          takeUntil(this._destroy$),
          tap(() => {
            this._alertaService.mensajaExitoso(
              'Item creado con exito',
              ``,
            );
            this.irAtras();
          }),
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }
}
