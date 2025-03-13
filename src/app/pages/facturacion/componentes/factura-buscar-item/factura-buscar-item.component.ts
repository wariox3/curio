import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturaTiposBusqueda } from '@type/factura-tipos-busqueda.type';
import { ItemApiService } from '../../services/item-api.service';
import { SoloNumerosDirective } from 'src/app/shared/directive/solo-numeros.directive';

@Component({
  selector: 'app-factura-buscar-item',
  standalone: true,
  imports: [NgClass, FormsModule, SoloNumerosDirective],
  templateUrl: './factura-buscar-item.component.html',
  styleUrl: './factura-buscar-item.component.scss',
})
export class FacturaBuscarItemComponent {
  private _itemApi = inject(ItemApiService);
  public tipoBusqueda = signal<FacturaTiposBusqueda>('id');
  public inputBusqueda: string | null = null;
  @ViewChild('campoBusqueda') campoBusqueda: ElementRef;

  seleccionarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this._actualizarTipoBusqueda(tipoBusqueda);
    this.campoBusqueda.nativeElement.focus();
  }

  buscarCampo() {
    if (this._debeBuscarPorCodigo()) {
      this._buscarPorId();
    } else {
      this._obtenerListaCompleta();
    }
  }

  limpiarBusqueda() {
    this.inputBusqueda = null;
    this._itemApi.lista().subscribe();
  }

  private _actualizarTipoBusqueda(tipoBusqueda: FacturaTiposBusqueda) {
    this.tipoBusqueda.update(() => tipoBusqueda);
  }

  private _obtenerListaCompleta() {
    this._itemApi.lista().subscribe();
  }

  private _buscarPorId() {
    this._itemApi.busquedaId(this.inputBusqueda).subscribe();
  }

  private _esNumero(value: string): boolean {
    // Verificar si el valor es un número usando una expresión regular
    return /^\d+$/.test(value);
  }

  private _debeBuscarPorCodigo(): boolean {
    return (
      (this.tipoBusqueda() === 'id' || this.tipoBusqueda() === 'codigoBarras')  &&
      this.inputBusqueda !== '' &&
      this._esNumero(this.inputBusqueda)
    );
  }
}
