import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { GeneralApiService } from 'src/app/shared/services/general.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionGeneralApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
  private URL_API_SUBDOMINIO = environment.url_api_subdominio;

  constructor() { }

  detalleConfiguracion(id: any) {
    return this._http.get<DocumentoTipo>(
      `${API_ENDPOINTS.GENERAL.DOCUMENTO_TIPO}${id}`,
    );
  }

  actualizarDocumentoTipo(data: any) {
    return this._http.patch<DocumentoTipo>(
      `${API_ENDPOINTS.GENERAL.CONFIGURACION}1/`,
      data,
    );
  }

  consultarDatosAutoCompletar<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    return this._generalService
      .consultaApi<T>(`${this.URL_API_SUBDOMINIO}${endpoint}`, queryParams)
  }

}
