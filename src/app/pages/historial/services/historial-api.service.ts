import { ParametrosFiltrosConsultasHttp } from './../../../core/model/interface/parametros-filtros-consulta-http.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { facturaInit } from '@constantes/factura.const';
import { DocumentoFactura } from '@interfaces/facturas.interface';
import { Filtros } from '@interfaces/filtros.interface';
import { Item } from '@interfaces/item.interface';
import { ValorFiltro } from '@type/valor-filtro.type';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class HistorialApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
  private _parametrosConsultaDocumento: ParametrosFiltrosConsultasHttp = {
    filtros: [
      {
        propiedad: 'documento_tipo__documento_clase_id',
        valor1: '105',
        operador: 'exact',
      },
      {
        propiedad: 'estado_aprobado',
        valor1: true,
        operador: 'exact',
      },
    ],
    modelo: 'GenDocumento',
    limite: 50,
    desplazar: 0,
    ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
    limite_conteo: 10000,
  };

  public arrFacturasSignal = signal<any[]>([]);
  public facturaSignal = signal<DocumentoFactura>(facturaInit);

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

  detalle(id: number) {
    return this._http
      .get<{
        documento: DocumentoFactura;
      }>(`${API_ENDPOINTS.GENERAL.DOCUMENTO}${id}/`)
      .pipe(tap((respuesta) => this.facturaSignal.set(respuesta.documento)));
  }

  historial() {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.DOCUMENTO}`, {
        documento_tipo__pos: true,
        ordering: 'estado_aprobado,-fecha,-numero,-id',
        serializador : 'lista'
      })
      .pipe(tap((response) => this.arrFacturasSignal.set(response.results)));
  }
}
