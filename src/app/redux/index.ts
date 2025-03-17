import { UsuarioEffects } from "./effects/usuario.effects";
import { facturaReducer } from "./reducers/factura.reducer";
import { usuarioReducer } from "./reducers/usuario.reducer";
import { contenedorReducer } from "./reducers/contenedor.reducer";
import { configuracionReducer } from "./reducers/configuracion.reducer";


export const StoreApp = {
  usuario: usuarioReducer,
  facturacion: facturaReducer,
  contenedor: contenedorReducer,
  configuracion: configuracionReducer,
};

export const EffectsApp = [
  UsuarioEffects,
];
