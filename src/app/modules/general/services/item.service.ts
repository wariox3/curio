import { ParametrosFiltrosConsultasHttp } from '../../../core/model/interface/parametros-filtros-consulta-http.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Filtros } from '@interfaces/filtros.interface';
import { Item } from '@interfaces/item.interface';
import { ValorFiltro } from '@type/valor-filtro.type';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class ItemApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
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

  public arrItemsSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.ITEM.LISTA}`, {
        venta: true,
        inactivo: false,
        ordering: '-favorito',
        //serializador: 'lista',
      })
      .pipe(
        tap((respuesta) => {
          this.arrItemsSignal.set(respuesta.results);
        }),
      );
  }

  busqueda(valor: ValorFiltro, filtros: any) {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.ITEM.LISTA}`, {
        venta: true,
        inactivo: false,
        ordering: '-favorito',
        ...filtros,
      })
      .pipe(tap((respuesta) => this.arrItemsSignal.set(respuesta.results)));
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
      `${API_ENDPOINTS.GENERAL.ITEM.LISTA}${itemId}/`,
      data,
    );
  }

  guardarItem(data: any) {
    return this._http.post<Item>(API_ENDPOINTS.GENERAL.ITEM.NUEVO, data);
  }

  editarItem(data: any, id: number) {
    return this._http.put<Item>(
      `${API_ENDPOINTS.GENERAL.ITEM.LISTA}${id}/`,
      data,
    );
  }

  cargarImagen(itemId: number, base64: string) {
    return this._http.post<{ mensaje: string }>(
      API_ENDPOINTS.GENERAL.ITEM.CARGAR_IMAGEN,
      {
        base64,
        id: itemId,
      },
    );
  }

  validarUso(id: number) {
    return this._http.post<{ uso: boolean }>(
      `${API_ENDPOINTS.GENERAL.ITEM.VALIDAR_USO}`,
      { id },
    );
  }

  eliminar(id: number) {
    return this._http.delete(`${API_ENDPOINTS.GENERAL.ITEM.LISTA}${id}/`);
  }
}
