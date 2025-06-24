import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { Contacto } from '@interfaces/contacto';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class ContactoApiService {
  private _http = inject(HttpClient);
  private _generalService = inject(GeneralApiService);
  public arrContactosSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._http
      .post<any>(API_ENDPOINTS.GENERAL.FUNCIONALIDAD_LISTAS, {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenContacto',
      } as ParametrosFiltrosConsultasHttp)
      .pipe(
        tap((respuesta) => {
          this.arrContactosSignal.set([contactoConsumidorFinal, ...respuesta.registros]);
        })
      );
  }

}
