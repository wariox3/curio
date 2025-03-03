import { Component, Input, output, signal } from '@angular/core';

@Component({
  selector: 'app-contador-cantidad',
  standalone: true,
  imports: [],
  templateUrl: './contador-cantidad.component.html',
  styleUrl: './contador-cantidad.component.css',
})
export class ContadorCantidadComponent {
  public cantidadSignal = signal(0);
  public emitirCantidad = output<number>();

  @Input() set cantidad(value: number) {
    this.cantidadSignal.set(value);
  }

  aumentar() {
    this._aumentarCantidad();
    this._emitirCantidad();
  }

  disminuir(): void {
    this._disminuirCantidad();
    this._emitirCantidad();
  }

  actualizarCantidad(event: Event): void {
    const valor = this._obtenerValorDesdeEvento(event);
    if (valor !== null) {
      this._actualizarCantidadSignal(valor);
      this._emitirCantidad();
    }
  }

  private _actualizarCantidadSignal(valor: number): void {
    this.cantidadSignal.set(valor);
  }

  private _obtenerValorDesdeEvento(event: Event): number | null {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    return isNaN(value) ? null : value;
  }

  private _aumentarCantidad(): void {
    this.cantidadSignal.update((cantidad) => cantidad + 1);
  }

  private _disminuirCantidad(): void {
    this.cantidadSignal.update((cantidad) => Math.max(cantidad - 1, 0));
  }

  private _emitirCantidad(): void {
    this.emitirCantidad.emit(this.cantidadSignal());
  }
}
