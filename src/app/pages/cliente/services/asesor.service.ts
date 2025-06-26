import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contacto, RespuestaAutocompletarContactoDian } from '@interfaces/contacto';
import { API_ENDPOINTS } from '@constantes/api-endpoints.const';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  constructor(private httpService: HttpClient) {
  }

  guardarContacto(data: Contacto) {
    return this.httpService.post<Contacto>(API_ENDPOINTS.GENERAL.CONTACTO.NUEVO, data);
  }

  autocompletar(data: { nit: number, identificacion_id: number }) {
    return this.httpService.post<RespuestaAutocompletarContactoDian>(API_ENDPOINTS.GENERAL.CONTACTO.CONSULTA_DIAN, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.get<Contacto>(`general/contacto/${id}/`);
  }

  actualizarDatosContacto(id: number, data: Contacto) {
    return this.httpService.put<Contacto>(`general/contacto/${id}/`, data);
  }

  validarNumeroIdentificacion(data: {
    identificacion_id: number;
    numero_identificacion: string;
  }) {
    return this.httpService.post<{ validacion: boolean; codigo: number }>(
      API_ENDPOINTS.GENERAL.CONTACTO.VALIDAR,
      data
    );
  }
}
