import { DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject, Input, output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { FacturaReduxService } from '../../services/factura-redux.service';

@Component({
  selector: 'app-factura-editar-item',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DecimalPipe, JsonPipe],
  templateUrl: './factura-editar-item.component.html',
  styleUrl: './factura-editar-item.component.scss',
})
export class FacturaEditarItemComponent {
  private _formBuilder = inject(FormBuilder);
  private _facturaReduxService = inject(FacturaReduxService);

  public emitirAccionFormulario = output<boolean>();

  @Input() item: DocumentoFacturaDetalleRespuesta;
  formularioVenta: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && !changes['item'].firstChange) {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario() {
    this.formularioVenta = this._formBuilder.group({
      precio: [this.item?.precio, [Validators.required, Validators.min(0)]],
      cantidad: [this.item?.cantidad,
        [Validators.required, Validators.min(1)],
      ],
      subtotal: [0]
    });

    this._calcularSubtotal();
    this.formularioVenta.get('precio')?.valueChanges.subscribe(() => this._calcularSubtotal());
    this.formularioVenta.get('cantidad')?.valueChanges.subscribe(() => this._calcularSubtotal());

  }

  private _calcularSubtotal(): void {
    const precio = this.formularioVenta.get('precio')?.value || 0;
    const cantidad = this.formularioVenta.get('cantidad')?.value || 0;
    this.formularioVenta.get('subtotal')?.setValue(precio*cantidad, { emitEvent: false });
  }

  guardar(): void {
    if (this.formularioVenta.valid) {
      this._facturaReduxService.actualizarCantidadItem(this.item.id, this.formularioVenta.get('cantidad').value)
      this._facturaReduxService.actualizarPrecioItem(this.item.id, this.formularioVenta.get('precio').value)
      this._facturaReduxService.calcularSubtotal(this.item.id)
      this.emitirAccionFormulario.emit(true)
    }
  }

  cancelar(){
    this.emitirAccionFormulario.emit(true)
  }
}
