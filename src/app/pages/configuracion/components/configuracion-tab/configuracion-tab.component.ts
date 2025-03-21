import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, output } from '@angular/core';
import { modulos } from '@constantes/modulos.const';
import { AplicacionModulos } from '@type/aplicacion-modulo.type';

@Component({
  selector: 'app-configuracion-tab',
  standalone: true,
  imports: [NgClass, TitleCasePipe],
  templateUrl: './configuracion-tab.component.html',
  styleUrl: './configuracion-tab.component.scss'
})
export class ConfiguracionTabComponent {
  public menuSeleccionado = 'general'
  public arrModulos = modulos
  public  emitirModulo = output<AplicacionModulos>()

  seleccionarConfiguracion(modulo: AplicacionModulos){
    this.emitirModulo.emit(modulo)
  }

}
