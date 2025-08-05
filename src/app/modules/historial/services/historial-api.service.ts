import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { facturaInit } from '@constantes/factura.const';
import { DocumentoFactura } from '@interfaces/facturas.interface';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class HistorialApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
  private _parametrosConsultaDocumento = {
    'documento_tipo__documento_clase_id': '105',
    'estado_aprobado': 'True',
    limit: 50,
    ordering: 'estado_aprobado, -fecha, -numero, -id',
  };

  public arrFacturasSignal = signal<any[]>([]);
  public facturaSignal = signal<DocumentoFactura>(facturaInit);

  constructor() { }

  lista() {
    return this._generalService
      .consultaApi<any>(
        API_ENDPOINTS.GENERAL.DOCUMENTO,
        this._parametrosConsultaDocumento,
      )
      .pipe(
        tap((respuesta) => {
          this.arrFacturasSignal.set(respuesta.results);
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
        documento_tipo__pos: 'True',
        ordering: 'estado_aprobado,-fecha,-numero,-id',
        serializador: 'lista'
      })
      .pipe(tap((response) => this.arrFacturasSignal.set(response.results)));
  }
}
