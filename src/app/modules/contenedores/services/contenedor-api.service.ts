import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';
import {
  ContenedorDetalle,
  ContenedorLista,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';
import { map } from 'rxjs';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { CookieService } from 'src/app/shared/services/cookie.service';
import { FilterTransformerService } from 'src/app/shared/services/filter-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class ContenedorApiService {
  private _cookieService = inject(CookieService);
  private _filterTransformService = inject(FilterTransformerService);
  public totalItems = 0;

  constructor(private http: HttpClient) {}

  lista(parametros: Record<string, any>) {
    const params = this._filterTransformService.toQueryString({
      ...parametros,
      serializador: 'lista',
      contenedor__ruteo: 'True',
    });


    return this.http.get<RespuestaApi<ContenedorLista>>(
      `${API_ENDPOINTS.CONTENEDORES.LISTA}?${params}`,
      {}
    ).pipe(
      map((res) => {
        // Store the total count for pagination
        this.totalItems = res.count;
        return {
          ...res,
          results: this._agregarPropiedades(res.results),
        };
      }),
    );
  }

  detalle(codigoContenedor: string) {
    return this.http.get<ContenedorDetalle>(
      `${API_ENDPOINTS.CONTENEDORES.DETALLE}${codigoContenedor}/`
    );
  }

  contedorConfiguracion(){
    return this.http.get(`${API_ENDPOINTS.GENERAL.CONFIGURACION}1`)
  }

   private _isContenedorRestringido(valorSaldo: number, fechaLimitePago: string) {
    // Si no hay fecha límite, no hay restricción
    if (!fechaLimitePago) {
      return false;
    }
    
    const fechaHoy = new Date();
    const fechaLimite = new Date(fechaLimitePago);
    
    // Normalizar las fechas para comparar solo año, mes y día
    const hoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate());
    const limite = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());

    // Si el saldo es mayor a 0 y la fecha límite ya pasó
    if (valorSaldo > 0 && hoy > limite) {
      return true; // Contenedor restringido
    }

    return false; // Contenedor no restringido
  }

  private _agregarPropiedades(contenedores: ContenedorLista[]) {
    // Obtener el usuario de la cookie para verificar saldo y fecha límite
    const usuarioCookie = this._cookieService?.get('usuario');
    let valorSaldo = 0;
    let fechaLimitePago = '';
    
    if (usuarioCookie) {
      try {
        const usuario = JSON.parse(usuarioCookie);
        valorSaldo = usuario.vr_saldo || 0;
        fechaLimitePago = usuario.fecha_limite_pago || '';
      } catch (error) {
        console.error('Error al parsear la cookie de usuario:', error);
      }
    }
    
    return contenedores.map((contenedor) => {
      return {
        ...contenedor,
        acceso_restringido: this._isContenedorRestringido(valorSaldo, fechaLimitePago)
      };
    });
  }
}
