import { Component, signal } from '@angular/core';
import { ConfiguracionTabComponent } from "../configuracion-tab/configuracion-tab.component";
import { AplicacionModulos } from '@type/aplicacion-modulo.type';
import { ConfiguracionGeneralComponent } from "../configuracion-general/configuracion-general.component";
import { ConfiguracionFacturacionComponent } from "../configuracion-facturacion/configuracion-facturacion.component";

@Component({
  selector: 'app-configuracion-base',
  standalone: true,
  imports: [ConfiguracionTabComponent, ConfiguracionGeneralComponent, ConfiguracionFacturacionComponent],
  templateUrl: './configuracion-base.component.html',
  styleUrl: './configuracion-base.component.scss'
})
export default class ConfiguracionBaseComponent {

  public menuSeleccionado= signal<AplicacionModulos>('general')

  cambiarVisualizarConfiguracion(modulo: AplicacionModulos){
    this.menuSeleccionado.set(modulo)
  }
}
