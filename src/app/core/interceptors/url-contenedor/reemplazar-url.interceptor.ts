import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ContenedorReduxService } from '@redux/services/contenedor-redux.service';

export const reemplazarUrlInterceptor: HttpInterceptorFn = (req, next) => {

  let _contenedorReduxService = inject(ContenedorReduxService)
  _contenedorReduxService.obtenerContendorSubdominio()
  const updatedUrl = req.url.replace('subdominio', _contenedorReduxService.contendorSubdomino);
  const modifiedReq = req.clone({ url: updatedUrl });
  return next(modifiedReq);
};
