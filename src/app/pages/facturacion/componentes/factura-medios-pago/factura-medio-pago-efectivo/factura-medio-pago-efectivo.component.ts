import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistroAutocompletarGenAsesor } from '@interfaces/asesor';
import { RegistroAutocompletarGenCuentaBanco } from '@interfaces/cuentas-banco.interface';
import { DocumentoFactura } from '@interfaces/facturas.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfiguracionReduxService } from '@redux/services/configuracion-redux.service';
import { FacturaEstadosBtnGuardar } from '@type/factura-estados-btn-guardar.type';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  catchError,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { AutocompletarApiService } from 'src/app/shared/services/autocompletar-api.service';
import { FacturaReduxService } from '../../../../../redux/services/factura-redux.service';
import { FormErrorComponent } from '../../../../../shared/components/form/form-error/form-error.component';
import { FacturaApiService } from '../../../services/factura-api.service';
import { InventarioApiService } from '../../../services/inventario-api.service';

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
  private _alertaService = inject(AlertaService);

  private _formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  public totalGeneralSignal = this._facturaReduxService.totalGeneralSignal;
  public emitirMedio = output<string>();
  public emitirPagoExito = output<boolean>();
  public textoBtn = signal<FacturaEstadosBtnGuardar>('Guardar');
  public arrAsesores = signal<RegistroAutocompletarGenAsesor[]>([]);
  public arrCuentasBancarias = signal<RegistroAutocompletarGenCuentaBanco[]>(
    [],
  );

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

    this._autocompletarApiService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBanco>({
        modelo: 'GenCuentaBanco',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrCuentasBancarias.set(respuesta.registros);
        this._sugerirPrimerValorCuentaBancaria();
      });
  }

  isGuardarDisabled() {
    // no se puede guardar un valor sin una cuenta
    if (
      this.formularioMedioPagoEfectivo.get('valor').value > 0 &&
      this.formularioMedioPagoEfectivo.get('cuenta_banco').value === null
    ) {
      return true;
    }

    return false;
  }

  private _sugerirPrimerValorCuentaBancaria() {
    if (this.arrCuentasBancarias().length > 0) {
      const primeraCuentaBanco = this.arrCuentasBancarias()?.[0];
      this.formularioMedioPagoEfectivo.patchValue({
        cuenta_banco: primeraCuentaBanco.cuenta_banco_id,
        cuenta_banco_nombre: primeraCuentaBanco.cuenta_banco_nombre,
      });
    }
  }

  private inicializarFormulario(): void {
    this.formularioMedioPagoEfectivo = this._formBuilder.group({
      asesor: [null],
      cuenta_banco: [null],
      cuenta_banco_nombre: [''],
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

  limpiarPagos() {
    // this._facturaReduxService.limpiarPagos();
  }

  submit() {
    if (this.formularioMedioPagoEfectivo.valid) {
      if (
        this.formularioMedioPagoEfectivo.get('valor').value > 0 &&
        this.formularioMedioPagoEfectivo.get('cuenta_banco').value === null
      ) {
        this._alertaService.mensajeError(
          'No puedes pagar',
          `Selecciona una cuenta de banco`,
        );

        return;
      } else {
        this._agregarPagoEnFactura();
      }

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

  private _agregarPagoEnFactura() {
    const cuentaBancoId =
      this.formularioMedioPagoEfectivo.get('cuenta_banco')?.value;
    const pago = this.formularioMedioPagoEfectivo.get('valor')?.value;
    const cuentaBancoNombre = this.formularioMedioPagoEfectivo.get(
      'cuenta_banco_nombre',
    )?.value;

    if (pago > 0) {
      this._facturaReduxService.agregarPago(
        cuentaBancoId,
        cuentaBancoNombre,
        pago,
      );
      this._facturaReduxService.actualizarTotalAfectado();
    }
  }

  private _obtenerDatosFactura() {
    return this._facturaReduxService
      .obtenerDataFactura()
      .pipe(takeUntil(this.destroy$));
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
