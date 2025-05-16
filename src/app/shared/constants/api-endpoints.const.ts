import { environment } from 'src/environment/environment';

export const API_BASE_URL = environment.url_api;
export const URL_API_SUBDOMINIO = environment.url_api_subdominio;

export const API_ENDPOINTS = {
  SEGURIDAD: {
    LOGIN: `${API_BASE_URL}/seguridad/login/`,
  },
  GENERAL: {
    FUNCIONALIDAD_LISTAS: `${URL_API_SUBDOMINIO}/general/funcionalidad/lista/`,
    DOCUMENTO: `${URL_API_SUBDOMINIO}/general/documento/`,
    DOCUMENTO_NUEVO: `${URL_API_SUBDOMINIO}/general/documento/nuevo/`,
    DOCUMENTO_APROBAR: `${URL_API_SUBDOMINIO}/general/documento/aprobar/`,
    DOCUMENTO_TIPO: `${URL_API_SUBDOMINIO}/general/documento_tipo/`,
    CONFIGURACION: `${URL_API_SUBDOMINIO}/general/configuracion/`,
    DOCUMENTO_IMPRIMIR: `general/documento/imprimir/`,

    ITEM: {
      DETALLE: `${URL_API_SUBDOMINIO}/general/item/detalle/`,
      GENERAL: `${URL_API_SUBDOMINIO}/general/item/`,
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
