export interface Contacto {
  id: number;
  identificacion: number;
  numero_identificacion: string;
  identificacion_abreviatura: string;
  nombre_corto: string;
  direccion: string;
  ciudad: number;
  ciudad_nombre: number;
  departamento_nombre?: string;
  telefono: number;
  celular: number;
  tipo_persona_id: number;
  tipo_persona: number;
  regimen_id: number;
  regimen_nombre: string;
  digito_verificacion: string | null;
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  codigo_postal: string | null;
  correo: string;
  codigo_ciuu: string;
  barrio: string;
  plazo_pago_id: number;
  plazo_pago_nombre: string;
  precio_id: number;
  precio_nombre: string;
  asesor_id: number;
  asesor_nombre_corto: string;
  plazo_pago_proveedor_id: number;
  plazo_pago_proveedor_nombre: string;
  cliente: boolean;
  proveedor: boolean;
  empleado: boolean;
  identificacion_id: number;
  ciudad_id: number;
  codigo: number;
  correo_facturacion_electronica: string;
  banco_id: number;
  banco_nombre: string;
  cuenta_banco_clase_id: number;
  cuenta_banco_clase_nombre: string;
  numero_cuenta: string;
}

export interface RespuestaAutocompletarContactoDian {
  encontrado: boolean
  nit: number
  nombre: string
  correo: string
}
