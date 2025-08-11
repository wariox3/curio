/**
 * Formateador de fecha en formato ISO (YYYY-MM-DD)
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @returns Cadena de fecha en formato YYYY-MM-DD
 */
export function formatearFechaISO(valor: string | Date | number): string {
  if (valor === null || valor === undefined) {
    return '';
  }
  return new Date(valor).toISOString().split('T')[0];
}

/**
 * Formateador de fecha con opciones personalizables
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @param locale Configuración regional (por defecto 'es-CO')
 * @param opciones Opciones de formato de fecha
 * @returns Cadena de fecha formateada según las opciones
 */
export function formatearFecha(
  valor: string | Date | number,
  locale: string = 'es-CO',
  opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string {
  if (valor === null || valor === undefined) {
    return '';
  }
  return new Date(valor).toLocaleDateString(locale, opciones);
}
