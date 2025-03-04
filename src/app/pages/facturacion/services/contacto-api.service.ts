import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Item } from '@interfaces/item.interface';
import { tap } from 'rxjs';
import { ParametrosFiltrosConsultasHttp } from '../../../core/model/interface/parametros-filtros-consulta-http.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactoApiService {
  private _http = inject(HttpClient);
  public arrContactosSignal = signal<Item[]>([]);

  constructor() {}

  lista() {
    return this._http
      .post<any>(API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS, {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenContacto',
      } as ParametrosFiltrosConsultasHttp)
      .pipe(
        tap((respuesta) => {
          this.arrContactosSignal.set(respuesta.registros);
        })
      );
  }

  listaSelect
}
