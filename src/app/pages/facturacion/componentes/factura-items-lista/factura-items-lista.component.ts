import { Component, inject, OnInit } from '@angular/core';
import { FacturaItemsCardComponent } from "../factura-items-card/factura-items-card.component";
import { ItemApiService } from './../../services/item-api.service';

@Component({
  selector: 'app-factura-items-lista',
  standalone: true,
  imports: [FacturaItemsCardComponent],
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
