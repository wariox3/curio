import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { AutocompletarRegistros } from '@interfaces/comun/autocompletar';
import { Observable } from 'rxjs';
import { ArchivosApiService } from './archivo-api.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralApiService {
  private archivosService = inject(ArchivosApiService);

  constructor() {}

  imprimirDocumento<T>(documentoTipoId: number, documentoId: number) {
    this.archivosService.descargarArchivo(
      API_ENDPOINTS.GENERAL.DOCUMENTO_IMPRIMIR,
      {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        documento_tipo_id: documentoTipoId,
        documento_id: documentoId,
      },
    );
  }
}
