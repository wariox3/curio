import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import { tap } from 'rxjs';
import { GeneralApiService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class CiudadApiServices {
  private _generalService = inject(GeneralApiService);
  public arrCiudadesSignal = signal<any[]>([]);

  constructor() {}

  lista(nombre: string) {
    return this._generalService
      .consultaApi(API_ENDPOINTS.GENERAL.CIUDAD.LISTA, {limit: 10, nombre__icontains: nombre})
      .pipe(
        tap((respuesta: any) => {
        const ciudadesConNombreCompleto = respuesta.map((ciudad: any) => ({
          ...ciudad,
          nombreCompleto: `${ciudad.nombre} - ${ciudad.estado__nombre}`
        }));
        this.arrCiudadesSignal.set(ciudadesConNombreCompleto);
        }),
      );
  }
}
