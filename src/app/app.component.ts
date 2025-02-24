import {
  AfterViewInit,
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import KTComponents from 'src/metronic/core';
import KTLayout from '../metronic/app/layouts/demo1';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'metronic-tailwind-angular';
  private _store = inject(Store);
  public existeUsuarioId$ =   this._store.select(obtenerUsuarioId);


  ngOnInit(): void {
    // this._store.select(obtenerUsuarioId).subscribe((respuesta) => {
    //   console.log(respuesta);

    //   this.existeUsuarioId = !!respuesta;
    // });
  }

  ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }


  ngOnDestroy(): void {
   // this.existeUsuarioId = false

  }
}
