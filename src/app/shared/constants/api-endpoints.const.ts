import { environment } from 'src/environments/environment';

export const API_BASE_URL = environment.url_api;
export const URL_API_SUBDOMINIO = environment.url_api_subdominio;

export const API_ENDPOINTS = {
  SEGURIDAD: {
    LOGIN: `${API_BASE_URL}/seguridad/login/`,
  },
  GENERAL: {
    DOCUMENTO: `${URL_API_SUBDOMINIO}/general/documento/`,
    DOCUMENTO_NUEVO: `${URL_API_SUBDOMINIO}/general/documento/nuevo/`,
    DOCUMENTO_APROBAR: `${URL_API_SUBDOMINIO}/general/documento/aprobar/`,
    DOCUMENTO_TIPO: `${URL_API_SUBDOMINIO}/general/documento_tipo/`,
    CONFIGURACION: `${URL_API_SUBDOMINIO}/general/configuracion/`,
    DOCUMENTO_IMPRIMIR: `general/documento/imprimir/`,
    ITEM: {
      DETALLE: `${URL_API_SUBDOMINIO}/general/item/detalle/`,
      LISTA: `${URL_API_SUBDOMINIO}/general/item/`,
      NUEVO: `${URL_API_SUBDOMINIO}/general/item/`,
      CARGAR_IMAGEN: `${URL_API_SUBDOMINIO}/general/item/cargar-imagen/`,
      VALIDAR_USO: `${URL_API_SUBDOMINIO}/general/item/validar-uso/`,
    },
    CONTACTO: {
      NUEVO: `${URL_API_SUBDOMINIO}/general/contacto/`,
      DETALLE: `${URL_API_SUBDOMINIO}/general/contacto/detalle/`,
      LISTA: `${URL_API_SUBDOMINIO}/general/contacto/`,
      VALIDAR: `${URL_API_SUBDOMINIO}/general/contacto/validar/`,
      CONSULTA_DIAN: `${URL_API_SUBDOMINIO}/general/contacto/consulta-dian/`,
    },
    ASESOR: {
      DETALLE: `${URL_API_SUBDOMINIO}/general/asesor/detalle/`,
      LISTA: `${URL_API_SUBDOMINIO}/general/asesor/seleccionar/`,
    },
    CUENTABANCO: {
      DETALLE: `${URL_API_SUBDOMINIO}/general/cuentabanco/detalle/`,
      LISTA: `${URL_API_SUBDOMINIO}/general/cuenta_banco/seleccionar/`,
    },
    IDENTIFICACION: {
      LISTA: `${URL_API_SUBDOMINIO}/general/identificacion/seleccionar/`,
    },
    BANCO: {
      LISTA: `${URL_API_SUBDOMINIO}/general/banco/seleccionar/`,
    },
    REGIMEN: {
      LISTA: `${URL_API_SUBDOMINIO}/general/regimen/seleccionar/`,
    },
    TIPOPERSONA: {
      LISTA: `${URL_API_SUBDOMINIO}/general/tipo_persona/seleccionar/`,
    },
    CIUDAD: {
      LISTA: `${URL_API_SUBDOMINIO}/general/ciudad/seleccionar/`,
    },
    LISTAPRECIO: {
      LISTA: `${URL_API_SUBDOMINIO}/general/precio/seleccionar/`,
    },
    PLAZOPAGO: {
      LISTA: `${URL_API_SUBDOMINIO}/general/plazo_pago/seleccionar/`,
    },
    IMPUESTO: {
      LISTA: `${URL_API_SUBDOMINIO}/general/impuesto/seleccionar/`,
    },

  },
  CONTENEDORES: {
    LISTA: `${API_BASE_URL}/contenedor/usuariocontenedor/consulta-usuario/`,
    DETALLE: `${API_BASE_URL}/contenedor/contenedor/`,
  },
  INVENTARIO: {
    EXISTENCIA_VALIDAR: `${URL_API_SUBDOMINIO}/inventario/existencia/validar/`,
  },
};
