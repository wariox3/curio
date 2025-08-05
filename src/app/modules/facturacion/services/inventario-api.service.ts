import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';

@Injectable({
  providedIn: 'root',
})
export class InventarioApiService {
  private _http = inject(HttpClient);

  constructor() {}

  existenciaValidar(detalles: any) {
    return this._http.post<any>(
      API_ENDPOINTS.INVENTARIO.EXISTENCIA_VALIDAR,
      {detalles}
    );
  }
}
