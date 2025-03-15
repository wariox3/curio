import { inject } from '@angular/core';
import { Router, CanMatchFn, ActivatedRoute } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';
import { ContenedorReduxService } from '@redux/services/contenedor-redux.service';

export const AutentificacionGuard: CanMatchFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const contenedorReduxService = inject(ContenedorReduxService);

  if (tokenService.validarToken()) {
    return contenedorReduxService.validarExistenciaContenedorCookie();
  }

  //redirect a la landing page
  router.navigate(['/auth']);
  return false;
};
