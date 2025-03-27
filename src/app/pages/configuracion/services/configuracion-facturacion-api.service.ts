import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { ParametrosFiltrosConsultasHttp } from '@interfaces/parametros-filtros-consulta-http.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionFacturacionApiService {
  private _http = inject(HttpClient);

  private _parametrosConsultaItem: ParametrosFiltrosConsultasHttp = {
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'GenSede',
    filtros: [ ],
  };

  constructor() {}

  consultarSedes() {
    return this._http
      .post<DocumentoTipo[]>(API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS, this._parametrosConsultaItem)
  }

}
