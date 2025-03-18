import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DocumentoFactura } from '@interfaces/facturas.interface';

@Component({
  selector: 'app-historial-item-card',
  standalone: true,
  imports: [DecimalPipe ],
  templateUrl: './historial-item-card.component.html',
})
export class HistorialItemCardComponent {
  @Input() factura: DocumentoFactura;

}
