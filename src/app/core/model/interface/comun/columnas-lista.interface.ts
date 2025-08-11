export interface ColumnaTabla {
  clave: string;
  nombre: string;
  ancho?: string; // Opcional para controlar el ancho de la columna
  formato?: (valor: any) => any; // Función para formatear el valor
  tooltip?: string; // Texto del tooltip para mostrar información adicional
  alineacion?: 'left' | 'center' | 'right'; // Alineación del texto en header y celdas
}
