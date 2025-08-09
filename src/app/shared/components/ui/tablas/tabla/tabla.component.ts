import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ColumnaTabla } from '@interfaces/comun/columnas-lista.interface';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
})
export class TablaComponent {
  // Propiedades de entrada
  @Input() columnas: ColumnaTabla[] = [];
  @Input() datos: any[] = [];
  @Input() claveCheckbox: string = 'id';
  @Input() mostrarAcciones: boolean = true;
  @Input() mostrarCheckbox: boolean = true;
  @Input() textoVacio: string = 'No hay datos disponibles';
  @Input() rutas: { editar: string; detalle: string } = { editar: '', detalle: '' };

  // Eventos de salida
  @Output() seleccionCambiada = new EventEmitter<any[]>();

  // Estado interno
  seleccionTodos: boolean = false;
  registrosSeleccionados: any[] = [];

  // Alternar selección de todos los registros - CORRECCIÓN PRINCIPAL
  alternarSeleccionTodos(): void {
    const nuevoEstado = !this.seleccionTodos;
    this.seleccionTodos = nuevoEstado;

    // Limpiar selección actual
    this.registrosSeleccionados = [];

    // Si estamos marcando (no desmarcando)
    if (nuevoEstado) {
      // Agregar todos los IDs de los datos actuales
      this.registrosSeleccionados = [...this.datos];
    }

    this.notificarSeleccion();
  }

  // Alternar selección individual - CORRECCIÓN ADICIONAL
  alternarSeleccion(registro: any, event: Event): void {
    event.stopPropagation();

    const index = this.registrosSeleccionados.findIndex(
      r => r[this.claveCheckbox] === registro[this.claveCheckbox]
    );

    if (index === -1) {
      this.registrosSeleccionados.push(registro);
    } else {
      this.registrosSeleccionados.splice(index, 1);
    }

    // Actualizar estado del checkbox principal
    this.seleccionTodos = this.registrosSeleccionados.length === this.datos.length;
    this.notificarSeleccion();
  }

  // Verificar selección
  estaSeleccionado(registro: any): boolean {
    return this.registrosSeleccionados.some(
      r => r[this.claveCheckbox] === registro[this.claveCheckbox]
    );
  }

  // Formatear valor si hay función de formato
  formatearValor(columna: any, valor: any): string {
    return columna.formato ? columna.formato(valor) : valor;
  }

  // Estado indeterminado para mejor UX
  get estadoIndeterminado(): boolean {
    return (
      this.registrosSeleccionados.length > 0 &&
      this.registrosSeleccionados.length < this.datos.length
    );
  }

  private notificarSeleccion(): void {
    this.seleccionCambiada.emit([...this.registrosSeleccionados]);
  }
}
