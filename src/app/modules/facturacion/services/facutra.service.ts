import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private _detalleId: number;

  public get detalleId(): number {
    return this._detalleId;
  }

  public set detalleId(id: number) {
    this._detalleId = id;
  }
}
