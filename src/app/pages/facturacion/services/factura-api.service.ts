import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { Item } from '@interfaces/item.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaApiService {
  private _http = inject(HttpClient);
  public arrContactosSignal = signal<Item[]>([]);

  constructor() {}

  nuevo(data: any) {
    return this._http.post<DocumentoFacturaDetalleRespuesta>(
      API_ENDPOINTS.GENERAL.DOCUMENTO,
      data
    );
  }

  aprobar(id: number) {
    return this._http.post<any>(API_ENDPOINTS.GENERAL.DOCUMENTO_APROBAR, {
      id,
    });
  }
}
