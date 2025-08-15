import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GeneralApiService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class AutocompletarApiService {
  private _http = inject(HttpClient);
  private URL_API_SUBDOMINIO = environment.url_api_subdominio;
  private _generalService = inject(GeneralApiService);

  constructor() {}

  consultarDatosAutoCompletar<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    return this._generalService
      .consultaApi<T>(`${this.URL_API_SUBDOMINIO}${endpoint}`, queryParams)
  }
}
