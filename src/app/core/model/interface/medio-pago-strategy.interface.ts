import { Observable } from "rxjs";

export interface MedioPagoStrategy {
  procesarPago(data: any): Observable<any>;
}
