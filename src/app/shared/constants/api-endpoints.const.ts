import { environment } from "src/environment/environment";

export const API_BASE_URL = environment.URL_API_MUUP;

export const API_ENDPOINTS = {
  SEGURIDAD: {
    LOGIN:`${environment.URL_API_MUUP}/seguridad/login/`,
  }
};
