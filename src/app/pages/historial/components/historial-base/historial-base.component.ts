import { Component } from '@angular/core';
import { HistorialListaComponent } from "../historial-lista/historial-lista.component";
import { HistorialDetalleComponent } from "../historial-detalle/historial-detalle.component";

@Component({
  selector: 'app-historial-base',
  standalone: true,
  imports: [HistorialListaComponent, HistorialDetalleComponent],
  templateUrl: './historial-base.component.html',
  styleUrl: './historial-base.component.scss'
})
export default class HistorialBaseComponent {

}
