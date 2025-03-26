import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfiguracionFacturacionApiService } from '../../services/configuracion-facturacion-api.service';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { FacturaReduxService } from '@redux/services/factura-redux.service';

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
  private _configuracionReduxService = inject(ConfiguracionReduxService);
  private _facturaReduxService = inject(FacturaReduxService);

  public configuracionSede = this._configuracionReduxService.obtenerSede();

  public arrSedes = signal<any[]>([]);

  ngOnInit(): void {
    this._consultarSedes();
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
  }
}
