import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para definir un campo de la tabla de detalles
 */
export interface CampoDetalle {
  /** Clave del campo en el objeto de datos */
  clave: string;
  /** Etiqueta que se mostrará en la tabla */
  etiqueta: string;
  /** Función opcional para formatear el valor antes de mostrarlo */
  formato?: (valor: any) => string;
  /** Ancho opcional para la columna de etiqueta (ej: 'w-1/4', '150px') */
  anchoEtiqueta?: string;
  /** Ancho opcional para la columna de valor (ej: 'w-1/4', '150px') */
  anchoValor?: string;
  /** Si el campo debe ocupar una fila completa (para comentarios largos) */
  filaCompleta?: boolean;
  /** Alineación del contenido del valor */
  alineacion?: 'izquierda' | 'centro' | 'derecha';
}

@Component({
  selector: 'app-tabla-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-detalles.component.html',
  styleUrls: ['./tabla-detalles.component.scss'],
})
export class TablaDetallesComponent {
  /**
   * Datos a mostrar en la tabla de detalles
   */
  @Input() datos: any = {};

  /**
   * Configuración de los campos a mostrar
   */
  @Input() campos: CampoDetalle[] = [];

  /**
   * Número de columnas para mostrar (2, 4, 6 u 8)
   * - 2: Una etiqueta y un valor por fila
   * - 4: Dos pares de etiqueta-valor por fila
   * - 6: Tres pares de etiqueta-valor por fila
   * - 8: Cuatro pares de etiqueta-valor por fila
   */
  @Input() columnas: 2 | 4 | 6 | 8 = 4;

  /**
   * Texto a mostrar cuando no hay datos
   */
  @Input() textoVacio: string = 'No hay datos disponibles';

  /**
   * Estilo de borde para la tabla
   */
  @Input() estiloBorde: 'redondeado' | 'cuadrado' | 'ninguno' = 'redondeado';

  /**
   * Estilo de fondo para las etiquetas
   */
  @Input() estiloFondo: 'gris' | 'azul' | 'ninguno' = 'gris';

  /**
   * Obtener las clases CSS para la alineación del valor
   */
  obtenerClasesAlineacion(alineacion?: 'izquierda' | 'centro' | 'derecha'): string {
    switch (alineacion) {
      case 'centro':
        return 'text-center';
      case 'derecha':
        return 'text-right';
      case 'izquierda':
      default:
        return 'text-left';
    }
  }

  /**
   * Obtener el valor formateado de un campo
   */
  obtenerValor(campo: CampoDetalle): string {
    if (!this.datos || this.datos[campo.clave] === undefined) {
      return '';
    }

    const valor = this.datos[campo.clave];
    return campo.formato ? campo.formato(valor) : valor;
  }

  /**
   * Verificar si hay datos disponibles
   */
  get hayDatos(): boolean {
    return this.datos && Object.keys(this.datos).length > 0;
  }

  /**
   * Obtener clase CSS para el contenedor de la tabla
   */
  get clasesContenedor(): string {
    let clases = 'overflow-x-auto';

    if (this.estiloBorde === 'redondeado') {
      clases += ' rounded-xl';
    }

    clases += ' bg-white border border-gray-200';

    return clases;
  }

  /**
   * Obtener clase CSS para las celdas de etiqueta
   */
  get clasesEtiqueta(): string {
    let clases = 'px-4 py-3 font-semibold text-sm text-gray-700 border-r border-gray-200';

    if (this.estiloFondo === 'gris') {
      clases += ' bg-gray-50';
    } else if (this.estiloFondo === 'azul') {
      clases += ' bg-blue-50';
    }

    return clases;
  }

  /**
   * Obtener el número de campos por fila según la configuración de columnas
   */
  get camposPorFila(): number {
    return this.columnas === 2 ? 1 : this.columnas === 4 ? 2 : this.columnas === 6 ? 3 : 4;
  }

  /**
   * Separar campos de fila completa de campos normales
   */
  get camposFilaCompleta(): CampoDetalle[] {
    return this.campos.filter(campo => campo.filaCompleta);
  }

  /**
   * Obtener campos normales (no de fila completa)
   */
  get camposNormales(): CampoDetalle[] {
    return this.campos.filter(campo => !campo.filaCompleta);
  }

  /**
   * Agrupar campos normales en filas según la configuración de columnas
   */
  get camposAgrupados(): CampoDetalle[][] {
    const camposNormales = this.camposNormales;
    const grupos: CampoDetalle[][] = [];

    for (let i = 0; i < camposNormales.length; i += this.camposPorFila) {
      grupos.push(camposNormales.slice(i, i + this.camposPorFila));
    }

    return grupos;
  }

  /**
   * Obtener todos los campos organizados para renderizado
   * Combina campos de fila completa y grupos de campos normales en el orden original
   */
  get camposOrganizados(): Array<{
    tipo: 'filaCompleta' | 'grupo';
    campo?: CampoDetalle;
    grupo?: CampoDetalle[];
  }> {
    const resultado: Array<{
      tipo: 'filaCompleta' | 'grupo';
      campo?: CampoDetalle;
      grupo?: CampoDetalle[];
    }> = [];
    let indiceNormales = 0;

    for (const campo of this.campos) {
      if (campo.filaCompleta) {
        resultado.push({ tipo: 'filaCompleta', campo });
      } else {
        // Si es el primer campo normal de un grupo, agregar el grupo completo
        if (indiceNormales % this.camposPorFila === 0) {
          const grupoActual = this.camposAgrupados[Math.floor(indiceNormales / this.camposPorFila)];
          if (grupoActual) {
            resultado.push({ tipo: 'grupo', grupo: grupoActual });
          }
        }
        indiceNormales++;
      }
    }

    return resultado;
  }
}
