import { Component, inject } from '@angular/core';
import { Contacto, ContactoSeleccionar } from '@interfaces/contacto';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturaReduxService } from '../../../../redux/services/factura-redux.service';
import { FormsModule } from '@angular/forms';
import { asyncScheduler, throttleTime } from 'rxjs';
import { ContactoApiService } from 'src/app/modules/facturacion/services/contacto-api.service';

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
    this._contactoApiService.seleccionar({ cliente: 'True' }).subscribe();
  }

  actualizarCliente(contacto: ContactoSeleccionar) {
    this._facturaReduxService.actualizarConctato(contacto);
  }

  consultarCliente(event: any) {
    this._contactoApiService
      .seleccionar({
        cliente: 'True',
        nombre_corto__icontains: event?.term ?? '',
      })
      .subscribe();
  }
}
