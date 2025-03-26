import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfiguracionFacturacionApiService } from '../../services/configuracion-facturacion-api.service';
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';

@Component({
  selector: 'app-configuracion-facturacion',
  standalone: true,
  imports: [LabelComponent],
  templateUrl: './configuracion-facturacion.component.html',
})
export class ConfiguracionFacturacionComponent implements OnInit {
  private _configuracionFacturacionApiService = inject(
    ConfiguracionFacturacionApiService,
  );
  private _ConfiguracionReduxService = inject(
    ConfiguracionReduxService
 );
  public configuracionSede =
  this._ConfiguracionReduxService.obtenerDocumentoSede();

  public arrSedes = signal<any[]>([]);

  ngOnInit(): void {
    this._consultarSedes();
  }

  cambiarSede(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.actualizarSede(valor);
  }

  private _consultarSedes() {
    this._configuracionFacturacionApiService
      .consultarSedes()
      .subscribe((respuesta: any) =>
        this.arrSedes.set(respuesta.registros),
      );
  }

  private actualizarSede(sedeId: string) {
    // this._configuracionGeneralApiService
    //   .actualizarDocumentoTipo({ pos_documento_tipo: documentoTipoId })
    //   .pipe(
    //     switchMap ((respuesta: any) => {
    //       return this._configuracionGeneralApiService.detalleConfiguracion(
    //         respuesta.pos_documento_tipo,
    //       )
    //     }),
    //     tap((respuestaDocumentoTipo: any)=> {
    //       //Guardar en redux
    //       this._ConfiguracionReduxService.actualizarDocumentoTipoId(respuestaDocumentoTipo.id)
    //       this._ConfiguracionReduxService.actualizarDocumentoTipoNombre(respuestaDocumentoTipo.nombre)
    //     })
    //   )
    //   .subscribe();
  }
}
