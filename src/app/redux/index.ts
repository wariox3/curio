import { UsuarioEffects } from "./effects/usuario.effects";
import { usuarioReducer } from "./reducers/usuario.reducer";


export const StoreApp = {
  usuario: usuarioReducer,
};

export const EffectsApp = [
  UsuarioEffects,
];
