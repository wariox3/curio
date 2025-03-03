import { UsuarioEffects } from "./effects/usuario.effects";
import { facturaReducer } from "./reducers/factura.reducer";
import { usuarioReducer } from "./reducers/usuario.reducer";


export const StoreApp = {
  usuario: usuarioReducer,
  factura: facturaReducer,
};

export const EffectsApp = [
  UsuarioEffects,
];
