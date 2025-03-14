import { environment } from "src/environment/environment";

export const API_BASE_URL = environment.url_api;
export const URL_API_SUBDOMINIO = environment.url_api_subdominio;

export const API_ENDPOINTS = {
  SEGURIDAD: {
    LOGIN:`${API_BASE_URL}/seguridad/login/`,
  },
  GENERAL: {
    FUNCIONALIDAD_LISTAS: `${URL_API_SUBDOMINIO}/general/funcionalidad/lista/`,
    DOCUMENTO: `${URL_API_SUBDOMINIO}/general/documento/`,
    DOCUMENTO_APROBAR: `${URL_API_SUBDOMINIO}/general/documento/aprobar/`,
    ITEM: {
      DETALLE: `${URL_API_SUBDOMINIO}/general/item/detalle/`,
    }
  },
  CONTENEDORES: {
    LISTA: `${API_BASE_URL}/contenedor/usuariocontenedor/consulta-usuario/`,
    DETALLE: `${API_BASE_URL}/contenedor/contenedor/`,
  }



};
