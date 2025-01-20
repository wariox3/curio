import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenService = inject(TokenService);

  const router = inject(Router);

  if (tokenService.validarToken()) {
    return true;
  }

  //redirect a la landing page
  router.navigate(['/auth']);
  return false;
};
