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
  Output,
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputComponent } from "@componentes/form/input/input.component";
import { MultiSelectComponent } from "@componentes/form/multi-select/multi-select.component";
import { filter, Subject, switchAll, switchMap, takeUntil, tap } from 'rxjs';
import { Item } from '../../../interface/item.interface';
import { ImpuestoService } from '../../../services/impuesto.service';
import { ItemApiService } from '../../../services/item.service';

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
    RouterModule
  ],
})
export default class ItemFormularioComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private _formBuilder = inject(FormBuilder);
  private _itemService = inject(ItemApiService);
  private _impuestoService = inject(ImpuestoService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _destroy$ = new Subject<void>();

  public accionFormulario = signal<'nuevo' | 'editar'>('nuevo');
  formularioItem: FormGroup;
  public arrImpuestos = signal<any[]>([]);
  @ViewChild('inputNombre', { read: ElementRef })
  inputNombre: ElementRef<HTMLInputElement>;
  @Input() abrirDesdeModal: boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

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
    impuesto: 0
  });

  constructor() { }

  ngOnInit() {
    this.iniciarFormulario();
    this._initCamposReactivos();
    this._consultarInformacion();
    this._consultarDetalle();
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
      impuestos_eliminados: this._formBuilder.array([]),
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
    if (!this.formularioItem.valid) {
      this.formularioItem.markAllAsTouched();
      return;
    }

    const acciones: Record<string, () => void> = {
      nuevo: () => this._nuevoItem(),
      editar: () => this._editarItem()
    };

    acciones[this.accionFormulario()]?.();
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

  private _nuevoItem() {
    this._itemService
      .guardarItem(this.formularioItem.value)
      .pipe(
        tap((respuesta: any) => {
          if (this.abrirDesdeModal) {
            this.emitirGuardoRegistro.emit(respuesta.item);
          } else {
            this.navegarDetalle(respuesta.item.id)
          }
        })
      )
      .subscribe();
  }

  private _editarItem() {
    this._itemService
      .editarItem(this.formularioItem.value, this.itemSignal().id)
      .pipe(
        tap((respuesta: any) => this.navegarDetalle(respuesta.item.id))
      )
      .subscribe();
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
    const arrImpuesto = this.formularioItem.get('impuestos_eliminados') as FormArray;
    let impuestoRetirado = this.itemImpuestos().find((item) => item.impuesto_id === impuesto.impuesto_id)
    const control = this._formBuilder.control(impuestoRetirado.id);
    arrImpuesto.push(control);
    this._changeDetectorRef.detectChanges();
  }

  private _consultarInformacion() {
    this._impuestoService.listaImpuestoVenta().subscribe((respuesta: any) => {
      this.arrImpuestos.set(respuesta);
    });
  }

  private _consultarDetalle() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._destroy$),
        filter((param: { id?: number }) => !!param.id),
        switchMap((param: { id: number }) =>
          this._itemService.detalle(param.id).pipe(
            tap((detalle: any) => {
              this.itemSignal.set(detalle.item);
              this._poblarFormulario(detalle.item);
              this._definirAccionEditarFormulario();
            }),
            switchMap(() => this._itemService.validarUso(param.id))
          )
        ),
        tap((respuestaItemEnUso) => {
          if (respuestaItemEnUso.uso) {
            this._inhabilitarCampos()
          }
        })
      )
      .subscribe();
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
        dato.impuesto_id
      ]);
    });
  }

  private _definirAccionEditarFormulario() {
    this.accionFormulario.set('editar');
  }

  private navegarDetalle(id: number) {
    this._router.navigate([`/administracion/item/detalle/${id}`]);
  }
}
