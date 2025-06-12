import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { AutocompletarRegistros } from '@interfaces/comun/autocompletar';
import { Observable } from 'rxjs';
import { ArchivosApiService } from './archivo-api.service';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class GeneralApiService {
  private _http = inject(HttpClient);
  private archivosService = inject(ArchivosApiService);

  constructor() {}

  imprimirDocumento<T>(documentoTipoId: number, documentoId: number) {
    this.archivosService.descargarArchivo(
      API_ENDPOINTS.GENERAL.DOCUMENTO_IMPRIMIR,
      {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        documento_tipo_id: documentoTipoId,
        documento_id: documentoId,
      },
    );
  }

  consultaApi<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    let params = new HttpParams();

    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== null && queryParams[key] !== undefined) {
        params = params.append(key, queryParams[key].toString());
      }
    });

    return this._http.get<RespuestaApi<T>>(endpoint, {params});
  }

}
