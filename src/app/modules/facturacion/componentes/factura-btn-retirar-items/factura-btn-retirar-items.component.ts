import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FacturaReduxService } from '@redux/services/factura-redux.service';
import { EMPTY, of, switchMap } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-factura-btn-retirar-items',
  standalone: true,
  imports: [NgClass],
  templateUrl: './factura-btn-retirar-items.component.html',
  styleUrl: './factura-btn-retirar-items.component.scss',
})
export class FacturaBtnRetirarItemsComponent {
  private _facturaReduxService = inject(FacturaReduxService);
  private _alertaService = inject(AlertaService);
  public totalProductosSignal = this._facturaReduxService.totalProductosSignal;

  retirarItems() {
    this._alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            this._facturaReduxService.reiniciarDetalles();
            return of(true);
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
