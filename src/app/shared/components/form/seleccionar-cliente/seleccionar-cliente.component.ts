import { Component, inject } from '@angular/core';
import { Contacto } from '@interfaces/contacto';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactoApiService } from '../../../../pages/facturacion/services/contacto-api.service';
import { FacturaReduxService } from '../../../../pages/facturacion/services/factura-redux.service';
import { FormsModule } from '@angular/forms';

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
  public arrContactosSignal = this._contactoApiService.arrContactosSignal
  public contactoFactura = this._facturaReduxService.facturaActivaContacto;

  ngOnInit(): void {
    this._contactoApiService.lista().subscribe()
  }

  actualizarCliente(contacto: Contacto){
    this._facturaReduxService.actualizarConctato(contacto)
  }

}
