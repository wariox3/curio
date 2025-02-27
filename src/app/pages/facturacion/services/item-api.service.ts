import { ParametrosFiltrosConsultasHttp } from './../../../core/model/interface/parametros-filtros-consulta-http.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Item } from '@interfaces/item.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemApiService {
  private _http = inject(HttpClient);
  public arrItemsSignal = signal<Item[]>([]);

  constructor() {}

  lista() {
    return this._http
      .post<any>(API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS, {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenItem',
      } as ParametrosFiltrosConsultasHttp)
      .pipe(tap((respuesta) => this.arrItemsSignal.set(respuesta.registros)));
  }
}
