import { ParametrosFiltrosConsultasHttp } from './../../../core/model/interface/parametros-filtros-consulta-http.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Filtros } from '@interfaces/filtros.interface';
import { Item } from '@interfaces/item.interface';
import { ValorFiltro } from '@type/valor-filtro.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistorialApiService {
  private _http = inject(HttpClient);
  private _parametrosConsultaDocumento: ParametrosFiltrosConsultasHttp = {
    filtros: [
      { propiedad: 'documento_tipo__documento_clase_id', valor1: '105', operador: 'exact' },
    ],
    modelo: 'GenDocumento',
    limite: 50,
    desplazar: 0,
    ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
    limite_conteo: 10000,
  };

  public arrFacturasSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._http
      .post<any>(
        API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS,
        this._parametrosConsultaDocumento,
      )
      .pipe(
        tap((respuesta) => {
          this.arrFacturasSignal.set(respuesta.registros);
        }),
      );
  }


  // detalle(itemId: number) {
  //   return this._http.post<any>(API_ENDPOINTS.GENERAL.ITEM.DETALLE, {
  //     compra: false,
  //     id: itemId,
  //     venta: true,
  //   });
  // }


}
