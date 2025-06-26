import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class RegimenApiServices {
  private _generalService = inject(GeneralApiService);
  public arrRegimenesSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalService
      .consultaApi(`${API_ENDPOINTS.GENERAL.REGIMEN.LISTA}`)
      .pipe(
        tap((respuesta: any) =>
          this.arrRegimenesSignal.set(respuesta),
        ),
      );
  }
}
