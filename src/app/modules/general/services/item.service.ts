import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Item } from '@interfaces/item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private _http = inject(HttpClient);


  constructor() {}


  consultarDetalle(id: number) {
    return this._http.get<any>(`general/item/${id}/`);
  }

  cargarImagen(itemId: number, base64: string) {
    return this._http.post<{ mensaje: string }>(`general/item/cargar-imagen/`, {
      base64,
      id: itemId,
    });
  }

  actualizarDatosItem(id: number, data: any) {
    return this._http.put<any>(`general/item/${id}/`, data);
  }

  consultarItemUso(id: number) {
    return this._http.post<{ uso: boolean }>(
      'general/item/validar-uso/',
      {
        id,
      },
    );
  }
}
