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
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FacturaEstadosBtnGuardar } from '@type/factura-estados-btn-guardar.type';

@Component({
  selector: 'app-factura-medio-pago-efectivo',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    FormErrorComponent,
    NgSelectModule,
  ],
  templateUrl: './factura-medio-pago-efectivo.component.html',
  styleUrl: './factura-medio-pago-efectivo.component.scss',
})
export class FacturaMedioPagoEfectivoComponent implements OnInit, OnDestroy {
  private _facturaReduxService = inject(FacturaReduxService);
  private _facturaApiService = inject(FacturaApiService);

  private _formBuilder = inject(FormBuilder);

  public totalGeneralSignal = this._facturaReduxService.totalGeneralSignal;
  public emitirMedio = output<string>();
  public emitirPagoExito = output<boolean>();
  private destroy$ = new Subject<void>();
  public textoBtn = signal<FacturaEstadosBtnGuardar>('Guardar');

  public formularioMedioPagoEfectivo!: FormGroup;
  public valorRestante = computed(
    () =>
      this.totalGeneralSignal() -
      (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0)
  );

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
            (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0)
        );
      });
  }

  regresarAmedioPagos() {
    this.emitirMedio.emit(null);
  }

  submit() {
    this._actualizarTextoBtn('Validando');
    this._obtenerDatosFactura()
      .pipe(
        switchMap((data) => this._crearFactura(data)),
        switchMap((respuesta: any) =>
          this._aprobarFactura(respuesta.documento.id)
        ),
        tap(() => this._finalizarProceso(true)),
        catchError(() => {
          this._finalizarProceso(false);
          return of(null);
        })
      )
      .subscribe();
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
      documento_tipo: 24,
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
