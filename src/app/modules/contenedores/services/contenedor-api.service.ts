import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import {
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';

@Injectable({
  providedIn: 'root',
})
export class ContenedorApiService {
  constructor(private http: HttpClient) {}

  lista(usuario_id: string) {
    return this.http.post<ListaContenedoresRespuesta>(
      API_ENDPOINTS.CONTENEDORES.LISTA,
      {
        usuario_id,
        reddoc: true,
      }
    );
  }

  detalle(codigoContenedor: string) {
    return this.http.get<ContenedorDetalle>(
      `${API_ENDPOINTS.CONTENEDORES.DETALLE}${codigoContenedor}/`
    );
  }

  contedorConfiguracion(){
    return this.http.get(`${API_ENDPOINTS.GENERAL.CONFIGURACION}1`)
  }
}
