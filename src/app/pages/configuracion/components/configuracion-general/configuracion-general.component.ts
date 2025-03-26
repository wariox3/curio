import { Component, inject, OnInit, signal } from '@angular/core';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { switchMap, tap } from 'rxjs';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ConfiguracionGeneralApiService } from '../../services/configuracion-general-api.service';

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
  private _ConfiguracionReduxService = inject(
    ConfiguracionReduxService
  )
  public arrDocumentos = signal<DocumentoTipo[]>([]);
  public documentoTipo =
  this._ConfiguracionReduxService.obtenerDocumentoTipoId();

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
      .subscribe((respuesta: any) => this.arrDocumentos.set(respuesta.registros));
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
          this._ConfiguracionReduxService.actualizarDocumentoTipoId(respuestaDocumentoTipo.id)
          this._ConfiguracionReduxService.actualizarDocumentoTipoNombre(respuestaDocumentoTipo.nombre)

        })
      )
      .subscribe();
  }
}
