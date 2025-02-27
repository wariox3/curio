import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-contador-cantidad',
  standalone: true,
  imports: [],
  templateUrl: './contador-cantidad.component.html',
  styleUrl: './contador-cantidad.component.css',
})
export class ContadorCantidadComponent {

  cantidadSignal = signal(0)

  @Input() set cantidad(value: number) {
    this.cantidadSignal.set(value);
  }

  aumentar() {
    this.cantidadSignal.update(cantidad => cantidad + 1);
  }

  disminuir() {
    this.cantidadSignal.update(cantidad => Math.max(cantidad - 1, 0));
  }

  actualizarCantidad(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value)) {
      this.cantidadSignal.set(value);
    }
  }
}
