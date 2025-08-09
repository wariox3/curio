export interface ColumnaTabla {
  clave: string;
  nombre: string;
  ancho?: string; // Opcional para controlar el ancho de la columna
  formato?: (valor: any) => any; // Función para formatear el valor
  tooltip?: string; // Texto del tooltip para mostrar información adicional
}
