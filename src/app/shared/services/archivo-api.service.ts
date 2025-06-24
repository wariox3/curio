import { inject, Injectable } from '@angular/core';
import { AlertaService } from './alerta.service';
import { URL_API_SUBDOMINIO } from '@constantes/api-endpoints.const';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchivosApiService {
  private alertaService = inject(AlertaService);
  private http = inject(HttpClient);
  private API_SUBDOMINIO = URL_API_SUBDOMINIO;

  public descargarArchivo(endpoint: string, data: any): void {
    const url = `${this.API_SUBDOMINIO}/${endpoint}`;
    this.alertaService.mensajaEspera('Cargando');
    this.http
      .post<HttpResponse<Blob>>(url, data, {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .pipe(
        catchError((error) => {
          this.alertaService.cerrarMensajes();
          this.alertaService.mensajeError(
            `Error 15`,
            'El documento no tiene un formato',
          );
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response !== null) {
          const headers = response.headers as HttpHeaders;
          if (headers.get('Content-Disposition') !== null) {
            let nombreArchivo = headers
              .get('Content-Disposition')!
              .split(';')[1]
              .trim()
              .split('=')[1];
            nombreArchivo = decodeURI(nombreArchivo.replace(/"/g, ''));

            if (!nombreArchivo) {
              throw new Error('fileName error');
            }
            const data: any = response.body;

            if (data !== null) {
              const blob = new Blob([data], {
                type: data?.type,
              });
              const objectUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none');
              a.setAttribute('href', objectUrl);
              a.setAttribute('download', nombreArchivo);
              a.click();
              URL.revokeObjectURL(objectUrl);
              setTimeout(() => this.alertaService.cerrarMensajes(), 1000);
            }
          } else {
            setTimeout(() => this.alertaService.cerrarMensajes(), 1000);
            throw new Error('Error no existe Content-Disposition');
          }
        }
      });
  }
}
