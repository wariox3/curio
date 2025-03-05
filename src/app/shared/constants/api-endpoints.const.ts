import { environment } from "src/environment/environment";

export const API_BASE_URL = environment.URL_API_MUUP;
export const URL_API_SUBDOMINIO = environment.URL_API_SUBDOMINIO;

export const API_ENDPOINTS = {
  SEGURIDAD: {
    LOGIN:`${API_BASE_URL}/seguridad/login/`,
  },
  GENERAL: {
    FUNCIONALIDAD_LISTAS: `${URL_API_SUBDOMINIO}/general/funcionalidad/lista/`,
    DOCUMENTO: `${URL_API_SUBDOMINIO}/general/documento/`,
  }
};
