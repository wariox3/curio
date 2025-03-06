import { UsuarioEffects } from "./effects/usuario.effects";
import { facturaReducer } from "./reducers/factura.reducer";
import { usuarioReducer } from "./reducers/usuario.reducer";
import { contenedorReducer } from "./reducers/contenedor.reducer";


export const StoreApp = {
  usuario: usuarioReducer,
  facturacion: facturaReducer,
  contenedor: contenedorReducer,
};

export const EffectsApp = [
  UsuarioEffects,
];
