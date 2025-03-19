import { Component, inject } from '@angular/core';
import { HistorialApiService } from '../../services/historial-api.service';
import { DecimalPipe } from '@angular/common';
import { LoaderComponent } from "../../../../shared/components/ui/loader/loader.component";

@Component({
  selector: 'app-historial-detalle',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './historial-detalle.component.html',
})
export class HistorialDetalleComponent {
  private _historialApiService = inject(HistorialApiService)

  public documento = this._historialApiService.facturaSignal


}
