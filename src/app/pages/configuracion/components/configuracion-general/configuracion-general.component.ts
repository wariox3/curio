import { Component, inject, OnInit, signal } from '@angular/core';
import { DocumentoTipo } from '@interfaces/documento-tipo.interface';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { switchMap, tap } from 'rxjs';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ConfiguracionGeneralApiService } from '../../services/configuracion-general-api.service';
import { FacturaReduxService } from '@redux/services/factura-redux.service';
import { ConfiguracionFacturacionApiService } from '../../services/configuracion-facturacion-api.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

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
  private _configuracionReduxService = inject(
    ConfiguracionReduxService
  )
  private _configuracionFacturacionApiService = inject(
    ConfiguracionFacturacionApiService,
  );
  private _facturaReduxService = inject(FacturaReduxService);
  private _alertaService = inject(AlertaService);



  public arrDocumentos = signal<DocumentoTipo[]>([]);
  public documentoTipo =
  this._configuracionReduxService.obtenerDocumentoTipoId();
  public configuracionSede = this._configuracionReduxService.obtenerSede();
  public arrSedes = signal<any[]>([]);


  ngOnInit(): void {
    this._consultarDocumentos();
    this._consultarSedes();
  }

  cambiarDocumentoTipo(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.actualizarDocumento(valor);
  }

  cambiarSede(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.actualizarSede(parseInt(valor));
  }

  private _consultarSedes() {
    this._configuracionFacturacionApiService
      .consultarSedes()
      .subscribe((respuesta: any) => this.arrSedes.set(respuesta.registros));
  }

  private actualizarSede(sede: number) {
    this._configuracionReduxService.actualizarConfiguracionSede(sede);
    this._facturaReduxService.actualizarAlmacenFacturas(sede);
    this._alertaService.mensajaExitoso('Actualización','Se actualizó la sede de todas las facturas')
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
          this._configuracionReduxService.actualizarDocumentoTipoId(respuestaDocumentoTipo.id)
          this._configuracionReduxService.actualizarDocumentoTipoNombre(respuestaDocumentoTipo.nombre)
          this._alertaService.mensajaExitoso('Actualización','Se actualizó el documento tipo')

        })
      )
      .subscribe();
  }
}
