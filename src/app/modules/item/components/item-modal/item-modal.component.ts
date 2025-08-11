import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalService } from '@componentes/ui/modal/modal.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { Item } from 'src/app/modules/general/interface/item.interface';
import ItemFormularioComponent from 'src/app/modules/general/pages/item/item-formulario/item-formulario.component';
import { ItemApiService } from 'src/app/modules/general/services/item.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [ItemFormularioComponent],
  templateUrl: './item-modal.component.html',
  styleUrl: './item-modal.component.css',
})
export class ItemModalComponent {
  @ViewChild('itemFormulario') itemFormulario!: ItemFormularioComponent;

  @Output() itemSubmitted = new EventEmitter<Item>();

  private _itemService = inject(ItemApiService);
  private _destroy$ = new Subject<void>();
  private _modalService = inject(ModalService);
  private _alertaService = inject(AlertaService);

  enviarFormulario() {
    this.itemFormulario?.enviarFormulario();
  }

  guardarItem(item: Item) {
    this._itemService
      .guardarItem(item)
      .pipe(
        takeUntil(this._destroy$),
        tap(() => {
          this._alertaService.mensajaExitoso('Item creado con exito', ``);
          this._modalService.close('formularioNuevoItem');
          this.itemSubmitted.emit(item);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }
}
