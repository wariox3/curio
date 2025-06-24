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
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.CONTACTO.LISTA}`, {
        serializador: 'lista',
      })
      .pipe(tap((respuesta) => this.arrContactosSignal.set(respuesta.results)));
  }

}
