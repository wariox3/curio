import { Usuario } from "@interfaces/usuario.interfece";
export interface Token {
  'refresh-token': string;
  token: string;
  user: Usuario;
}
