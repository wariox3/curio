import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { GeneralApiService } from 'src/app/shared/services/general.service';
import { Item } from '../../../interface/item.interface';
import { Router, RouterModule } from '@angular/router';
import { TablaComponent } from "@componentes/ui/tablas/tabla/tabla.component";
import { columnasItemLista } from '../../../mapeo/item-lista.mapeo';
import { ItemApiService } from '../../../services/item.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-item-lista',
  standalone: true,
  imports: [SiNoPipe, DecimalPipe, RouterModule, TablaComponent],
  templateUrl: './item-lista.component.html',
})
export default class ItemListaComponent implements OnInit {

  private _router = inject(Router);
  private _generalService = inject(GeneralApiService);
  private _itemService = inject(ItemApiService);

  public arrItemsSignal = signal<Item[]>([]);
  public itemSeleccionados = signal<Item[]>([]);

  public columnas = columnasItemLista;
  ngOnInit(): void {
    this._consultarLista();
  }

  navegarDetalle(id: number) {
    this._router.navigate([`/administracion/item/detalle/${id}`]);
  }

  navegarEditar(id: number) {
    this._router.navigate([`/administracion/item/editar/${id}`]);
  }

  onSeleccionItems(items: Item[]) {
    this.itemSeleccionados.set(items);
  }

  eliminar() {
    const eliminaciones$ = this.itemSeleccionados().map(conductor =>
      this._itemService.eliminar(conductor.id)
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        // Después de eliminar, volver a la primera página y recargar
        // this.estadoPaginacion.update(estado => ({
        //   ...estado,
        //   paginaActual: 1,
        // }));
        this._consultarLista();
        this.itemSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar conductor:', err);
      },
    });
  }


  private _consultarLista() {
    this._generalService
      .consultaApi<Item>(`${API_ENDPOINTS.GENERAL.ITEM.LISTA}`, {
        venta: 'True',
        inactivo: 'False',
      }).subscribe((respuesta) => {
        this.arrItemsSignal.set(respuesta.results);
      });
  }




}
