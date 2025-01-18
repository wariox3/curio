import { Usuario } from "@interfaces/usuario";
export interface Token {
  'refresh-token': string;
  token: string;
  user: Usuario;
}
