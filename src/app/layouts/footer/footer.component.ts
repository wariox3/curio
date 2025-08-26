import { environment } from 'src/environments/environment';
import { Component, HostBinding, inject } from '@angular/core';
import { FechasService } from 'src/app/shared/services/fechas.service';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private _fachaService = inject(FechasService)

  public anioActual  = this._fachaService.obtenerAnioActual()

  public urlDocumentacion = environment.appDocumentacion

  @HostBinding('class') hostClass = 'footer w-full max-w-[75rem]';

}
