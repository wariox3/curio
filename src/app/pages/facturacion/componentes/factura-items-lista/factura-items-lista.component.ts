import { ItemApiService } from './../../services/item-api.service';
import { Component, OnInit, signal, inject } from '@angular/core';
import { Item } from '@interfaces/item.interface';

@Component({
  selector: 'app-factura-items-lista',
  standalone: true,
  imports: [],
  templateUrl: './factura-items-lista.component.html',
  styleUrl: './factura-items-lista.component.scss',
})
export class FacturaItemsListaComponent implements OnInit {

  private _itemApi = inject(ItemApiService)

  public arrItemsSignal = this._itemApi.arrItemsSignal

  ngOnInit(): void {
    this._itemApi.lista().subscribe()
  }
}
