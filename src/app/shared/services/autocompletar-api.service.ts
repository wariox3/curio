import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { AutocompletarRegistros } from '@interfaces/comun/autocompletar';
import { Observable } from 'rxjs';
import { ParametrosFiltrosConsultasHttp } from '../../core/model/interface/parametros-filtros-consulta-http.interface';
import { environment } from 'src/environment/environment';
import { GeneralApiService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class AutocompletarApiService {
  private _http = inject(HttpClient);
  private URL_API_SUBDOMINIO = environment.url_api_subdominio;
  private _generalService = inject(GeneralApiService);

  constructor() {}

  // consultarDatosAutoCompletar<T>(
  //   filtros: Readonly<Partial<ParametrosFiltrosConsultasHttp>>,
  // ): Observable<AutocompletarRegistros<T>> {
  //   return this._http.post<AutocompletarRegistros<T>>(
  //     API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS,
  //     filtros,
  //   );
  // }

  consultarDatosAutoCompletar<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    return this._generalService
      .consultaApi<T>(`${this.URL_API_SUBDOMINIO}${endpoint}`, queryParams)
  }
}
