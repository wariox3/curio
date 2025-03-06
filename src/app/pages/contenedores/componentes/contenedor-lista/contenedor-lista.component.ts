import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@componentes/ui/button/button.component';
import {
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ContenedorApiService } from '../../services/contenedor-api.service';
import { ContenedorReduxService } from '../../services/contenedor-redux.service';

@Component({
  selector: 'app-contenedor-lista',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './contenedor-lista.component.html',
})
export default class ContenedorListaComponent implements OnInit {
  private _contenedorService = inject(ContenedorApiService);
  private _contenedorReduxService = inject(ContenedorReduxService);
  private _store = inject(Store);
  private _alertaService = inject(AlertaService);
  private _router = inject(Router);
  public arrConectando: boolean[] = [];
  public arrContenedores = signal<any[]>([]);

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    this._store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this._contenedorService.lista(respuestaUsuarioId.toString())
        ),
        tap((respuestaLista: ListaContenedoresRespuesta) => {
          respuestaLista.contenedores.forEach(() =>
            this.arrConectando.push(false)
          );
          this.arrContenedores.set(respuestaLista.contenedores);
        }),
        catchError(({ error }) => {
          this._alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
          return of(null);
        })
      )
      .subscribe();
  }

  seleccionarEmpresa(contenedor_id: string, indexContenedor: number) {
    this.arrConectando[indexContenedor] = true;
    this._contenedorService
      .detalle(contenedor_id)
      .pipe(
        catchError(() => {
          this.arrConectando[indexContenedor] = false;
          return of(null);
        })
      )
      .subscribe((respuesta: ContenedorDetalle) => {
        this._contenedorReduxService.cargarContenedor(respuesta);
        this.arrConectando[indexContenedor] = false;
        this._router.navigate(['/dashboard/facturacion']);
      });
  }
}
