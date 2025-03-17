import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfiguracionGeneralApiService } from '../../services/configuracion-general-api.service';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { switchAll, switchMap, tap } from 'rxjs';
import { ConfiguracionReduxServiceService } from '@redux/services/configuracion-redux-service.service';

@Component({
  selector: 'app-configuracion-general',
  standalone: true,
  imports: [LabelComponent],
  templateUrl: './configuracion-general.component.html',
  styleUrl: './configuracion-general.component.scss',
})
export class ConfiguracionGeneralComponent implements OnInit {
  private _configuracionGeneralApiService = inject(
    ConfiguracionGeneralApiService,
  );
  private _configuracionReduxServiceService = inject(
    ConfiguracionReduxServiceService
  )
  public arrDocumentos = signal<DocumentoTipo[]>([]);

  ngOnInit(): void {
    this._consultarDocumentos();
  }

  cambiarDocumentoTipo(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.actualizarDocumento(valor);
  }

  private _consultarDocumentos() {
    this._configuracionGeneralApiService
      .consultarDocumentosVenta()
      .subscribe((respuesta) => this.arrDocumentos.set(respuesta));
  }

  private actualizarDocumento(documentoTipoId: string) {
    this._configuracionGeneralApiService
      .actualizarDocumentoTipo({ pos_documento_tipo: documentoTipoId })
      .pipe(
        switchMap ((respuesta: any) => {
          return this._configuracionGeneralApiService.detalleConfiguracion(
            respuesta.pos_documento_tipo,
          )
        }),
        tap((respuestaDocumentoTipo: any)=> {
          //Guardar en redux
          this._configuracionReduxServiceService.actualizarDocumentoTipoId(respuestaDocumentoTipo.id)
          this._configuracionReduxServiceService.actualizarDocumentoTipoNombre(respuestaDocumentoTipo.nombre)

        })
      )
      .subscribe();
  }
}
