import type {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';;
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from './http-error.service';
import { AlertaService } from '../../../shared/services/alerta.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertaService);
  const authService = inject(AuthService);
  const errorHandlerService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const { statusCode, codigo, mensaje } = errorHandlerService.manejarError(error);

      // Special actions for specific codes (e.g., 401)
      if (statusCode === 401) {
        authService.logout();
      }

      // Show an alert for non-asset related errors
      if (!error.url?.includes('asset')) {
        alertService.mensajeError(`Error ${codigo || statusCode}`, mensaje);
      }

      return throwError(() => error.error);
    })
  );
};
