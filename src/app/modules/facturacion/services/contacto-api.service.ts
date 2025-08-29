import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class ContactoApiService {
  private _generalService = inject(GeneralApiService);
  public arrContactosSignal = signal<any[]>([]);

  constructor() {}

  lista(nombre: string) {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.CONTACTO.LISTA}`, {
        serializador: 'lista',
        cliente: 'True',
        nombre_corto__icontains: nombre
      })
      .pipe(tap((respuesta) => this.arrContactosSignal.set(respuesta.results)));
  }

}
