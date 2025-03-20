import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';
import { DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../../../../shared/components/form/form-error/form-error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturaApiService } from '../../../services/factura-api.service';
import {
  catchError,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { FacturaEstadosBtnGuardar } from '@type/factura-estados-btn-guardar.type';
import { InventarioApiService } from '../../../services/inventario-api.service';
import { DocumentoFactura } from '@interfaces/facturas.interface';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RegistroAutocompletarGenAsesor } from '@interfaces/asesor';
import { AutocompletarApiService } from 'src/app/shared/services/autocompletar-api.service';

@Component({
  selector: 'app-factura-medio-pago-efectivo',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    FormErrorComponent,
    NgSelectModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './factura-medio-pago-efectivo.component.html',
  styleUrl: './factura-medio-pago-efectivo.component.scss',
})
export class FacturaMedioPagoEfectivoComponent implements OnInit, OnDestroy {
  private _facturaReduxService = inject(FacturaReduxService);
  private _facturaApiService = inject(FacturaApiService);
  private _inventarioApiService = inject(InventarioApiService);
  private _ConfiguracionReduxService = inject(ConfiguracionReduxService);
  private _autocompletarApiService = inject(AutocompletarApiService);

  private _formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  public totalGeneralSignal = this._facturaReduxService.totalGeneralSignal;
  public emitirMedio = output<string>();
  public emitirPagoExito = output<boolean>();
  public textoBtn = signal<FacturaEstadosBtnGuardar>('Guardar');
  public arrAsesores = signal<RegistroAutocompletarGenAsesor[]>([]);

  public formularioMedioPagoEfectivo!: FormGroup;
  public documentoTipo =
    this._ConfiguracionReduxService.obtenerDocumentoTipoId();
  public valorRestante = computed(
    () =>
      this.totalGeneralSignal() -
      (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0),
  );
  public valorDevolder = computed(
    () =>
      this.totalGeneralSignal() -
      (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0),
  );

  ngOnInit(): void {
    this.consultarInformacion();
    this.inicializarFormulario();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  consultarInformacion() {
    this._autocompletarApiService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenAsesor>({
        modelo: 'GenAsesor',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrAsesores.set(respuesta.registros);
      });
  }

  private inicializarFormulario(): void {
    this.formularioMedioPagoEfectivo = this._formBuilder.group({
      asesor: [null, Validators.required],
      valor: [
        this.totalGeneralSignal(),
        [Validators.required, Validators.min(0)],
      ],
    });

    this.formularioMedioPagoEfectivo
      .get('asesor')
      ?.valueChanges.subscribe((value) => {
        this._facturaReduxService.actualizarAsesor(value);
      });

    this.formularioMedioPagoEfectivo
      .get('valor')
      ?.valueChanges.subscribe((value) => {
        if (isNaN(value) || value < 0) {
          this.formularioMedioPagoEfectivo
            .get('valor')
            ?.setValue(this.totalGeneralSignal(), { emitEvent: false });
        }
        this.valorRestante = computed(
          () =>
            this.totalGeneralSignal() -
            (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0),
        );
        this.valorDevolder = computed(
          () =>
            (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0) -
            this.totalGeneralSignal(),
        );
      });
  }

  regresarAmedioPagos() {
    this.emitirMedio.emit(null);
  }

  submit() {
    if (this.formularioMedioPagoEfectivo.valid) {
      this._actualizarTextoBtn('Validando');
      this._obtenerDatosFactura()
        .pipe(
          switchMap((data) =>
            this._inventarioApiService
              .existenciaValidar(data.detalles)
              .pipe(withLatestFrom(of(data))),
          ),
          switchMap(([respuestaValidacion, data]) => {
            if (respuestaValidacion.validar) {
              return of(data);
            }
            return of(null);
          }),
          switchMap((data: DocumentoFactura | null) => {
            return data ? this._crearFactura(data) : of(null);
          }),
          switchMap((respuesta: any) => {
            if (respuesta !== null) {
              return this._aprobarFactura(respuesta.documento.id);
            }
            return of(null);
          }),
          tap((respuestaFacturaProbada: any) => {
            if (respuestaFacturaProbada.estado_aprobado) {
              this._finalizarProceso(true);
            }
          }),
          catchError(() => {
            this._finalizarProceso(false);
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.formularioMedioPagoEfectivo.markAllAsTouched();
    }
  }

  private _obtenerDatosFactura() {
    return this._facturaReduxService.obtenerDataFactura().pipe(
      tap((respuesta) => console.log(respuesta)),
      takeUntil(this.destroy$),
    );
  }

  private _crearFactura(data: any) {
    this._actualizarTextoBtn('Guardando');
    return this._facturaApiService.nuevo({
      ...data,
      documento_tipo: this.documentoTipo,
      numero: null,
      empresa: 1,
      contacto: data.contacto_id,
    });
  }

  private _aprobarFactura(documentoId: number) {
    this._actualizarTextoBtn('Aprobando');
    return this._facturaApiService.aprobar(documentoId);
  }

  private _finalizarProceso(exito: boolean) {
    this._actualizarTextoBtn('Guardar');
    if (exito) {
      this.emitirPagoExito.emit(true);
    }
  }

  private _actualizarTextoBtn(texto: FacturaEstadosBtnGuardar) {
    this.textoBtn.update(() => texto);
  }
}
