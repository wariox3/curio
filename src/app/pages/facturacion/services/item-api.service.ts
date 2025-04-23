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
export class ItemApiService {
  private _http = inject(HttpClient);
  private _parametrosConsultaItem: ParametrosFiltrosConsultasHttp = {
    limite: 50,
    desplazar: 0,
    ordenamientos: ['-favorito'],
    limite_conteo: 0,
    modelo: 'GenItem',
    filtros: [
      {
        propiedad: 'venta',
        valor1: true,
        operador: 'exact',
      },
      {
        propiedad: 'inactivo',
        valor1: false,
        operador: 'exact',
      },
    ],
  };

  public arrItemsSignal = signal<Item[]>([]);

  constructor() {}

  lista() {
    return this._http
      .post<any>(
        API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS,
        this._parametrosConsultaItem
      )
      .pipe(
        tap((respuesta) => {
          this.arrItemsSignal.set(respuesta.registros);
        })
      );
  }

  busqueda(valor: ValorFiltro, filtros: Filtros[]) {
    return this._http
      .post<any>(API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS, {
        ...this._parametrosConsultaItem,
        filtros: [...this._parametrosConsultaItem.filtros, ...filtros], // Combina los filtros existentes con los nuevos
      } as ParametrosFiltrosConsultasHttp)
      .pipe(
        tap((respuesta) => {
          this.arrItemsSignal.set(respuesta.registros);
        })
      );
  }

  detalle(itemId: number) {
    return this._http.post<any>(API_ENDPOINTS.GENERAL.ITEM.DETALLE, {
      compra: false,
      id: itemId,
      venta: true,
    });
  }

  actualizarFavorito(itemId: number, data: any) {
    return this._http.patch<any>(
      `${API_ENDPOINTS.GENERAL.ITEM.GENERAL}${itemId}/`,
      data
    );
  }
}
