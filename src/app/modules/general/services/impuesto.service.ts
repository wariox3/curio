import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS } from "@constantes/api-endpoints.const";
import { RespuestaApi } from "src/app/core/interfaces/api.interface";
import { GeneralApiService } from "src/app/shared/services/general.service";

@Injectable({
  providedIn: 'root',
})
export class ImpuestoService {
  private _generalService = inject(GeneralApiService);

  listaImpuestoVenta() {
    return this._generalService
      .consultaApi<any>(`${API_ENDPOINTS.GENERAL.IMPUESTO.LISTA}`, {
        venta: 'True'
      })
  }

}
