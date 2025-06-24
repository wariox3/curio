import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { ParametrosFiltrosConsultasHttp } from '@interfaces/parametros-filtros-consulta-http.interface';
import { map, tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionGeneralApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
  private URL_API_SUBDOMINIO = environment.url_api_subdominio;
  private _parametrosConsultaItem: ParametrosFiltrosConsultasHttp = {
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'GenDocumentoTipo',
    filtros: [
      {
        propiedad: 'venta',
        valor1: true,
        operador: 'exact',
      },
      {
        propiedad: 'operacion',
        valor1: 1,
        operador: 'exact',
      },
    ],
  };

  constructor() {}

  consultarDocumentosVenta() {
    return this._http.post<DocumentoTipo[]>(
      API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS,
      this._parametrosConsultaItem,
    );
    // .pipe(
    //   map((documentos) => documentos.filter((doc) => doc.venta === true)),
    // );
  }

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

  // lista() {
  //   return this._generalService
  //     .consultaApi(`${API_ENDPOINTS.GENERAL.ITEM.LISTA}`, {
  //       venta: true,
  //       inactivo: false,
  //       ordering: '-favorito',
  //       serializador: 'lista',
  //     })
  //     .pipe(tap((respuesta) => this.arrItemsSignal.set(respuesta.results)));
  // }
}
