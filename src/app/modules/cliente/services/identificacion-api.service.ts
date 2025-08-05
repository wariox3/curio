import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class IdentificacionApiServices {
  private _generalService = inject(GeneralApiService);
  public arrIdentificacionesSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.IDENTIFICACION.LISTA}`)
      .pipe(
        tap((respuesta: any) =>
          this.arrIdentificacionesSignal.set(respuesta),
        ),
      );
  }
}
