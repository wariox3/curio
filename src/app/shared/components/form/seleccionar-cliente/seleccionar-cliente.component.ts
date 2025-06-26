import { Component, inject } from '@angular/core';
import { Contacto } from '@interfaces/contacto';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactoApiService } from '../../../../pages/facturacion/services/contacto-api.service';
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';
import { FormsModule } from '@angular/forms';
import { asyncScheduler, throttleTime } from 'rxjs';

@Component({
  selector: 'app-seleccionar-cliente',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './seleccionar-cliente.component.html',
  styleUrl: './seleccionar-cliente.component.scss',
})
export class SeleccionarClienteComponent {
  private _contactoApiService = inject(ContactoApiService);
  private _facturaReduxService = inject(FacturaReduxService);
  public arrContactosSignal = this._contactoApiService.arrContactosSignal;
  public contactoFactura = this._facturaReduxService.facturaActivaContacto;

  ngOnInit(): void {
    this._contactoApiService.lista('').subscribe();
  }

  actualizarCliente(contacto: Contacto) {
    this._facturaReduxService.actualizarConctato(contacto);
  }

  consultarCliente(event: any) {
    this._contactoApiService
      .lista(event?.term ?? '')
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
      )
      .subscribe();
  }
}
