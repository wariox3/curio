import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from "@componentes/form/input/input.component";
import { MultiSelectComponent } from "@componentes/form/multi-select/multi-select.component";
import { KTModal } from '@metronic/components/modal/modal';
import { finalize, Subject, switchMap, tap } from 'rxjs';
import { ItemApiService } from 'src/app/modules/facturacion/services/item-api.service';
import { ImpuestoService } from '../../../services/impuesto.service';

@Component({
  selector: 'app-item-formulario',
  standalone: true,
  templateUrl: './item-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    MultiSelectComponent
  ],
})
export default class ItemFormularioComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // private readonly _generalService = inject(GeneralService);
  // private readonly _configModuleService = inject(ConfigModuleService);
  private _formBuilder = inject(FormBuilder);
  private _itemService = inject(ItemApiService);
  private _impuestoService = inject(ImpuestoService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  // arrCuentasLista: RegistroAutocompletarConCuenta[];
  formularioItem: FormGroup;
  // arrImpuestosEliminado: number[] = [];
  public arrImpuestos = signal<any[]>([]);
  // cuentaCodigo = '';
  // cuentaNombre = '';
  // cuentaCobrarCodigo = '';
  // cuentaCobrarNombre = '';
  // @Input() informacionFormulario: any;
  // @Input() itemTipo: 'compra' | 'venta' = 'venta';
  // @ViewChild('inputImpuestos', { static: false })
  // inputImpuestos: HTMLInputElement;
  @ViewChild('inputNombre', { read: ElementRef })
  inputNombre: ElementRef<HTMLInputElement>;
  @ViewChild('modalFormulario') modalFormulario!: ElementRef;

  public valorInventarioDefecto = signal<boolean>(false);
  public valorServicioDefecto = signal<boolean>(false);
  public valorProductoDefecto = signal<boolean>(false);
  public itemEnUso = signal<boolean>(false);
  private _destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit() {
    this.iniciarFormulario();
    this._initCamposReactivos();
    this._consultarInformacion();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  abrirModal() {
    this._toggleModal(this.modalFormulario);
  }

  private _toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }

  ngAfterViewInit() {
    if (this.inputNombre?.nativeElement.value === '') {
      this.inputNombre?.nativeElement.focus();
    }
  }

  private _inhabilitarCampos() {
    this.itemEnUso.set(true);
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
      precio: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      costo: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      productoServicio: ['producto'],
      producto: [true],
      servicio: [false],
      inventario: [true],
      impuestos: this._formBuilder.array([]),
      cuenta_venta: [null],
      cuenta_compra: [null],
      favorito: [false],
      venta: [false],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioItem.controls;
  }

  enviarFormulario() {
    if (this.formularioItem.valid) {
      this._nuevoItem();
    } else {
      this.formularioItem.markAllAsTouched();
    }
  }

  private _nuevoItem() {
    this._itemService
      .guardarItem(this.formularioItem.value)
      .pipe(
        switchMap(() => this._itemService.lista()),
        tap(() => this._toggleModal(this.modalFormulario)),
        finalize(() => this.formularioItem.reset())
      )
      .subscribe();
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


  private _consultarInformacion() {
    this._impuestoService.listaImpuestoVenta().subscribe((respuesta: any) => {
      this.arrImpuestos.set(respuesta);
    });
  }
}
