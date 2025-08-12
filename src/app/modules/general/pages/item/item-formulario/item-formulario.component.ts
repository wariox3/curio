import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  signal,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputComponent } from '@componentes/form/input/input.component';
import { MultiSelectComponent } from '@componentes/form/multi-select/multi-select.component';
import { Subject } from 'rxjs';
import { Item } from '../../../interface/item.interface';
import { ImpuestoService } from '../../../services/impuesto.service';
import { CurrencyInputComponent } from "@componentes/form/currency-input/currency-input.component";

@Component({
  selector: 'app-item-formulario',
  standalone: true,
  templateUrl: './item-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    MultiSelectComponent,
    RouterModule,
    CurrencyInputComponent
],
})
export default class ItemFormularioComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  // Inputs
  @Input() item?: Item | null = null;
  @Input() estaItemEnUso?: boolean = false;

  // Outputs
  @Output() itemSubmitted: EventEmitter<any> = new EventEmitter();

  // ViewChild
  @ViewChild('inputNombre', { read: ElementRef })
  inputNombre!: ElementRef<HTMLInputElement>;

  // Services
  private _formBuilder = inject(FormBuilder);
  private _impuestoService = inject(ImpuestoService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$ = new Subject<void>();

  // Public properties
  public formularioItem!: FormGroup;
  public arrImpuestos = signal<any[]>([]);
  public valorInventarioDefecto = signal<boolean>(false);
  public valorServicioDefecto = signal<boolean>(false);
  public valorProductoDefecto = signal<boolean>(false);
  public itemImpuestos = signal<any>([]);
  public itemImpuestosSeleccionados = signal<number[]>([]);
  public itemEnUso = signal<boolean>(false);
  public itemSignal = signal<Item>({
    id: 0,
    impuestos: [],
    nombre: '',
    codigo: '',
    referencia: '',
    costo: 0,
    precio: 0,
    base: 0,
    porcentaje: 0,
    total: 0,
    nombre_extendido: '',
    porcentaje_total: 0,
    venta: false,
    compra: false,
    producto: false,
    servicio: false,
    inventario: false,
    existencia: 0,
    disponible: 0,
    cantidad: 0,
    subtotal: 0,
    favorito: false,
    imagen: '',
    impuesto: 0,
  });

  ngOnInit() {
    this.iniciarFormulario();
    this._initCamposReactivos();
    this._consultarInformacion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && changes['item'].currentValue) {
      this._poblarFormulario(changes['item'].currentValue);
    }

    if (changes['estaItemEnUso'] && changes['estaItemEnUso'].currentValue) {
      if (changes['estaItemEnUso'].currentValue) {
        this._inhabilitarCampos();
      }
      this.itemEnUso.set(changes['estaItemEnUso'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.inputNombre?.nativeElement.value === '') {
      this.inputNombre?.nativeElement.focus();
    }
  }

  private _inhabilitarCampos() {
    this.formularioItem.get('inventario')?.disable();
    this.formularioItem.get('productoServicio')?.disable();
  }

  private _initCamposReactivos() {
    this._handleCampoServicio();
    this._handleCampoInventario();
  }

  private _handleCampoServicio() {
    this.formularioItem.get('servicio')?.valueChanges.subscribe((value) => {
      const inventarioControl = this.formularioItem.get('inventario');
      if (value) {
        inventarioControl?.setValue(false, { emitEvent: false });
      } else {
        inventarioControl?.setValue(this.valorInventarioDefecto(), {
          emitEvent: false,
        });
      }
    });
  }

  private _handleCampoInventario() {
    this.formularioItem.get('inventario')?.valueChanges.subscribe((value) => {
      const esServicio = this.formularioItem.get('servicio')?.value;
      const inventarioControl = this.formularioItem.get('inventario');
      if (esServicio) {
        inventarioControl?.setValue(false, { emitEvent: false });
      } else {
        inventarioControl?.setValue(value, { emitEvent: false });
      }
    });
  }

  iniciarFormulario() {
    this.formularioItem = this._formBuilder.group({
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      referencia: [null, Validators.compose([Validators.maxLength(50)])],
      precio: [0, Validators.compose([Validators.min(0)])],
      costo: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      productoServicio: ['producto'],
      producto: [true],
      servicio: [false],
      inventario: [true],
      impuestos: this._formBuilder.array([]),
      impuestos_eliminados: this._formBuilder.array([]),
      cuenta_venta: [null],
      cuenta_compra: [null],
      favorito: [false],
      venta: [true],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioItem.controls;
  }

  // Método público para que el padre pueda disparar el submit
  public enviarFormulario(): void {
    if (!this.formularioItem.valid) {
      this.formularioItem.markAllAsTouched();
      return;
    }

    this.itemSubmitted.emit(this.formularioItem.value);
  }

  limpiarFormulario() {
    this.formularioItem.reset();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioItem?.markAsDirty();
    this.formularioItem?.markAsTouched();
    if (campo === 'referencia') {
      if (this.formularioItem.get(campo)?.value === '') {
        this.formularioItem.get(campo)?.setValue(null);
      }
    }
    if (campo === 'producto' && !this.itemEnUso()) {
      this.formularioItem.get(campo)?.setValue(true);
      this.formularioItem.get('servicio')?.setValue(false);
      this.formularioItem.get('inventario')?.setValue(true);
    }
    if (campo === 'servicio' && !this.itemEnUso()) {
      this.formularioItem.get(campo)?.setValue(true);
      this.formularioItem.get('producto')?.setValue(false);
    }
    if (campo === 'precio' || campo === 'costo') {
      if (this.formularioItem.get(campo)?.value === '') {
        this.formularioItem.get(campo)?.setValue(dato);
      }
    }
    if (campo === 'impuestos') {
      const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;
      // // Limpiar el FormArray actual
      arrImpuesto.clear();
      dato.forEach((dato: any) => {
        this._agregarImpuesto(dato);
      });
    }
    if (campo === 'impuestos_eliminados') {
      this._agregarImpuestoEliminado(dato);
    }
    this._changeDetectorRef.detectChanges();
  }

  private _agregarImpuesto(impuesto: any) {
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;
    let impuestoFormGrup = this._formBuilder.group({
      impuesto: [impuesto],
    });
    arrImpuesto.push(impuestoFormGrup);
    this._changeDetectorRef.detectChanges();
  }

  private _agregarImpuestoEliminado(impuesto: any) {
    const arrImpuesto = this.formularioItem.get(
      'impuestos_eliminados',
    ) as FormArray;
    let impuestoRetirado = this.itemImpuestos().find(
      (item) => item.impuesto_id === impuesto.impuesto_id,
    );
    const control = this._formBuilder.control(impuestoRetirado.id);
    arrImpuesto.push(control);
    this._changeDetectorRef.detectChanges();
  }

  private _consultarInformacion() {
    this._impuestoService.listaImpuestoVenta().subscribe((respuesta: any) => {
      this.arrImpuestos.set(respuesta);
    });
  }

  private _poblarFormulario(data: Item) {
    this.formularioItem.patchValue({
      codigo: data.codigo,
      nombre: data.nombre,
      referencia: data.referencia,
      precio: data.precio,
      costo: data.costo,
      productoServicio: data.producto ? 'producto' : 'servicio',
      producto: data.producto,
      servicio: data.servicio,
      inventario: data.inventario,
      favorito: data.favorito,
      venta: data.venta,
    });
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;
    arrImpuesto.clear();
    this.itemImpuestos.set(data.impuestos);
    this.itemImpuestosSeleccionados.set([]);

    data.impuestos.forEach((dato: any) => {
      this.itemImpuestosSeleccionados.update((current) => [
        ...current,
        dato.impuesto_id,
      ]);
    });
  }
}
