import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Item } from '@interfaces/item.interface';
import { tap } from 'rxjs';
import { ParametrosFiltrosConsultasHttp } from '../../../core/model/interface/parametros-filtros-consulta-http.interface';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';

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
}
