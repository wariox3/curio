import { Pipe, PipeTransform } from '@angular/core';


/**
 * `TruncatePipe` es un Pipe personalizado en Angular que transforma recorta un texto.
 *
 * ### Uso básico:
 *
 * ```html
 * <p>{{ 'palabra' | truncate:2 }}</p> <!-- Muestra: pa -->
 * ```
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.length < limit
      ? value
      : value.slice(0, limit)+ '...';;
  }
}
