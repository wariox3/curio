import { DecimalPipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputComponent } from '@componentes/form/input/input.component';
import { LabelComponent } from '@componentes/form/label/label.component';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { FacturaReduxService } from '@redux/services/factura-redux.service';

@Component({
  selector: 'app-factura-editar-item',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    LabelComponent,
    InputComponent,
  ],
  templateUrl: './factura-editar-item.component.html',
  styleUrl: './factura-editar-item.component.scss',
})
export class FacturaEditarItemComponent implements OnInit, OnChanges {
  private _facturaReduxService = inject(FacturaReduxService);
  public emitirAccionFormulario = output<boolean>();
  public formularioVenta: ReturnType<typeof this.inicializarFormulario>;

  @Input() item: DocumentoFacturaDetalleRespuesta = {
    id: 0,
    documento_id: 0,
    item: 0,
    item_nombre: '',
    cuenta: undefined,
    cuenta_codigo: '',
    cuenta_nombre: '',
    cantidad: 0,
    precio: 0,
    pago: 0,
    pago_operado: 0,
    porcentaje: 0,
    porcentaje_descuento: 0,
    descuento: 0,
    subtotal: 0,
    total_bruto: 0,
    base_impuesto: 0,
    base: 0,
    impuesto: 0,
    impuesto_operado: 0,
    impuesto_retencion: 0,
    total: 0,
    hora: 0,
    dias: 0,
    devengado: 0,
    deducion: 0,
    operacion: 0,
    base_cotizacion: 0,
    base_prestacion: 0,
    documento_afectado_id: undefined,
    documento_afectado_numero: '',
    documento_afectado_contacto_nombre_corto: '',
    contacto_id: undefined,
    contacto_nombre_corto: '',
    naturaleza: undefined,
    detalle: undefined,
    numero: undefined,
    concepto_id: undefined,
    concepto_nombre: '',
    tipo_registro: '',
    credito_id: undefined,
    grupo_id: 0,
    grupo_nombre: '',
    almacen: 0,
    almacen_id: 0,
    almacen_nombre: '',
    impuestos: [],
  };

  ngOnInit(): void {
    this.formularioVenta = this.inicializarFormulario();
    this._suscribirCambiosFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && !changes['item'].firstChange) {
      this.formularioVenta = this.inicializarFormulario();
      this._suscribirCambiosFormulario();
    }
  }

  inicializarFormulario() {
    const subTotal = this.item?.precio * this.item?.cantidad;
    return new FormGroup({
      precio: new FormControl(this.item?.precio, [
        Validators.required,
        Validators.min(0),
      ]),
      cantidad: new FormControl(this.item?.cantidad, [
        Validators.required,
        Validators.min(1),
      ]),
      subtotal: new FormControl(subTotal),
    });
  }

  private _suscribirCambiosFormulario() {
    this.formularioVenta.controls.precio.valueChanges.subscribe(() => {
      this._calcularSubtotal();
    });

    this.formularioVenta.controls.cantidad.valueChanges.subscribe(() => {
      this._calcularSubtotal();
    });
  }

  private _calcularSubtotal(): void {
    const precio = this.formularioVenta.get('precio')?.value || 0;
    const cantidad = this.formularioVenta.get('cantidad')?.value || 0;
    this.formularioVenta
      .get('subtotal')
      ?.setValue(precio * cantidad, { emitEvent: false });
  }

  guardar(): void {
    if (this.formularioVenta.valid) {
      this._facturaReduxService.actualizarCantidadItem(
        this.item.item,
        this.formularioVenta.get('cantidad').value
      );
      this._facturaReduxService.actualizarPrecioItem(
        this.item.item,
        this.formularioVenta.get('precio').value
      );
      this._facturaReduxService.calcularValoresFacturaActivaDetalle(
        this.item.item
      );
      this._facturaReduxService.calcularValoresFacturaActivaEncabezado();
      this.emitirAccionFormulario.emit(true);
    }
  }

  cancelar() {
    this.emitirAccionFormulario.emit(true);
  }
}
