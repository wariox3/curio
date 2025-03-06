import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@componentes/ui/button/button.component';
import {
  Contenedor,
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ContenedorService } from '../../services/contenedor.service';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenedor-lista',
  standalone: true,
  imports: [
    // CommonModule,
    ButtonComponent,
    // RouterLink,
    // ModalDefaultComponent,
    // ContenedorEliminarComponent,
  ],
  templateUrl: './contenedor-lista.component.html',
})
export default class ContenedorListaComponent implements OnInit {
  // @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  private _contenedorService = inject(ContenedorService);
  private _store = inject(Store);
  private _alertaService = inject(AlertaService);
  private _router = inject(Router);

  // private menuService = inject(NbMenuService);
  // private windowService = inject(NbWindowService);
  // private destroy$ = new Subject<void>();
  // windowRef: NbWindowRef | null;
  public arrConectando: boolean[] = [];
  public arrContenedores = signal<any[]>([]);
  // contenedor: Contenedor;
  // dominioApp = environment.dominioApp;
  // public toggleModal$ = new BehaviorSubject(false);

  ngOnInit() {
    this.consultarLista();
    // this.menu();
    // this.limpiarContenedores();
  }

  // limpiarContenedores() {
  //   this.store.dispatch(ContenedorActionBorrarInformacion());
  //   this.changeDetectorRef.detectChanges();
  // }

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
        const contenedor: Contenedor = {
          nombre: respuesta.nombre,
          imagen: respuesta.imagen,
          contenedor_id: respuesta.id,
          subdominio: respuesta.subdominio,
          id: respuesta.id,
          usuario_id: respuesta.usuario_id,
          seleccion: true,
          rol: '',
          plan_id: respuesta.plan_id,
          plan_nombre: respuesta.plan_nombre,
          usuarios: respuesta.plan_limite_usuarios,
          usuarios_base: respuesta.plan_usuarios_base,
          reddoc: respuesta.reddoc,
          ruteo: respuesta.ruteo,
          acceso_restringido: respuesta.acceso_restringido,
        };
        this._store.dispatch(ContenedorActionInit({ contenedor }));
        this.arrConectando[indexContenedor] = false;
        this._router.navigate(['/dashboard/facturacion'])
      });
  }


}
