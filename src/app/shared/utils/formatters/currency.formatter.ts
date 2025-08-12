/**
 * Formateador de moneda para valores en pesos colombianos (COP)
 * @param valor Valor numérico a formatear
 * @returns Cadena formateada con el símbolo de moneda y separadores
 */
export function formatearMonedaCOP(valor: number): string {
  if (valor === null || valor === undefined) {
    return '';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Formateador genérico de moneda que permite especificar la moneda y el locale
 * @param valor Valor numérico a formatear
 * @param moneda Código ISO de la moneda (por defecto 'COP')
 * @param locale Configuración regional (por defecto 'es-CO')
 * @returns Cadena formateada con el símbolo de moneda y separadores
 */
export function formatearMoneda(
  valor: number,
  moneda: string = 'COP',
  locale: string = 'es-CO'
): string {
  if (valor === null || valor === undefined) {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moneda,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}
