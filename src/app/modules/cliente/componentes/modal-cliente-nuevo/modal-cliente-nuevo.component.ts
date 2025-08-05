import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { ParametrosFiltros } from '@interfaces/comun/parametro-filtros.interface';
import { KTModal } from '@metronic/components/modal/modal';
import { asyncScheduler, debounceTime, tap, throttleTime, zip } from 'rxjs';
// import { RegistroAutocompletarGenCiudad } from 'src/app/core/model/general/autocompletar/general/gen-ciudad.interface';
// import { GeneralService } from 'src/app/core/services/general.service';
// import { cambiarVacioPorNulo } from 'src/app/core/validations/campo-no-obligatorio.validator';
// import { MultiplesEmailValidator } from 'src/app/core/validations/multiples-email-validator';
import { InputValueCaseDirective } from 'src/app/shared/directive/input-value-case.directive';
import { ContactoService } from '../../services/contacto.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormErrorComponent } from '../../../../shared/components/form/form-error/form-error.component';
import { IdentificacionApiServices } from '../../services/identificacion-api.service';
import { RegimenApiServices } from '../../services/regimen-api.service';
import { DevuelveDigitoVerificacionService } from '../../services/devuelve-digito-verificacion.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CiudadApiServices } from '../../services/ciudad-api.service';
import { AsesorApiServices } from '../../services/asesor-api.service';
import { BancoApiServices } from '../../services/banco-api.service';
import { TipoPersonaApiServices } from '../../services/tipo-persona-api.service';
import { ListaPreciosApiServices } from '../../services/lista-precios-api.service';
import { CuentaBancoApiServices } from '../../services/cuenta-banco-api.service';
import { PlazoPagoApiServices } from '../../services/plazo-pago-api.service';
import { cambiarVacioPorNulo } from 'src/app/shared/directive/campo-no-obligatorio.validator';
import { MultiplesEmailValidator } from 'src/app/shared/directive/multiples-email-validator';
import { ContactoApiService } from 'src/app/modules/facturacion/services/contacto-api.service';

@Component({
  selector: 'app-modal-cliente-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    InputValueCaseDirective,
    FormsModule,
    ReactiveFormsModule,
    FormErrorComponent,
    NgSelectModule,
  ],
  templateUrl: './modal-cliente-nuevo.component.html',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      transition(':enter, :leave', [animate(600)]),
    ]),
  ],
})
export class ModalClienteNuevoComponent {
  private _identificacionApiServices = inject(IdentificacionApiServices);
  private _regimenApiServices = inject(RegimenApiServices);
  private _tipoPersonaApiServices = inject(TipoPersonaApiServices);
  private _plazoPagoApiServices = inject(PlazoPagoApiServices);
  private _ciudadApiServices = inject(CiudadApiServices);
  private _bancoApiServices = inject(BancoApiServices);
  private _asesorApiServices = inject(AsesorApiServices);
  private _listaPreciosApiServices = inject(ListaPreciosApiServices);
  private _cuentaBancoApiServices = inject(CuentaBancoApiServices);
  private _contactoApiService = inject(ContactoApiService);

  private devuelveDigitoVerificacionService = inject(
    DevuelveDigitoVerificacionService,
  );
  private formBuilder = inject(FormBuilder);
  private _contactoService = inject(ContactoService);

  formularioContacto: FormGroup;
  filtroIdentificacionSignal = signal(1);
  arrIdentificacionSignal =
    this._identificacionApiServices.arrIdentificacionesSignal;
  arrRegimenSignal = this._regimenApiServices.arrRegimenesSignal;
  arrTipoPersonaSignal = this._tipoPersonaApiServices.arrTiposPersonasSignal;
  arrPreciosSignal = this._listaPreciosApiServices.arrListaPreciosSignal;
  arrAsesoresSignal = this._asesorApiServices.arrAsesorSignal;
  arrPagosSignal = this._plazoPagoApiServices.arrPlazoPagosSignal;
  arrBancosSignal = this._bancoApiServices.arrBancosSignal;
  arrCiudadesSignal = this._ciudadApiServices.arrCiudadesSignal;
  arrCuentasBancosSignal = this._cuentaBancoApiServices.arrCuentaBancosSignal;
  informacionContacto: any;
  ciudadSeleccionada: any;
  selectedDateIndex: number = -1;

  ngOnInit() {
    this._iniciarFormulario();
    this._iniciarSuscripcionesFormularioContacto();
  }
  filteredIdentificacionSignal = computed(
    () =>
      this.arrIdentificacionSignal().filter(
        (item) => item.tipo_persona === this.filtroIdentificacionSignal(),
      ) || [],
  );
  @ViewChild('modalNuevoCliente') modalNuevoCliente!: ElementRef;

  abrirModal() {
    this._toggleModal(this.modalNuevoCliente);
    this._consultarInformacion();
    this.formularioContacto.reset();
    this._iniciarFormulario();
    this._iniciarSuscripcionesFormularioContacto();
  }

  tipoPersonaSeleccionado($event: any) {
    let valorPersonaTipo = parseInt($event.target.value);
    this.filtroIdentificacionSignal.update(() => valorPersonaTipo);
    if (valorPersonaTipo === 1) {
      //1 es igual a juridico
      this._setValidators('nombre1', [
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this._setValidators('apellido1', [
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this._setValidators('nombre_corto', [
        Validators.required,
        Validators.maxLength(200),
      ]);
      // if (this.accion === 'nuevo') {
      //   this.formularioContacto.patchValue({
      //     nombre1: null,
      //     nombre2: null,
      //     apellido1: null,
      //     apellido2: null,
      //     identificacion:
      //       this.filteredIdentificacionSignal()[0].identificacion_id,
      //   });
      // } else {
      //   this.formularioContacto.patchValue({
      //     identificacion:
      //       this.filteredIdentificacionSignal()[0].identificacion_id,
      //   });
      // }
    } else {
      //2 es natural
      this._setValidators('nombre1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this._setValidators('apellido1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this._setValidators('nombre_corto', [Validators.maxLength(200)]);
      // if (this.accion === 'nuevo') {
      //   this.formularioContacto.patchValue({
      //     identificacion:
      //       this.filteredIdentificacionSignal()[0].identificacion_id,
      //   });
      // }
      // if (this.accion === 'editar') {
      //   this.formularioContacto.patchValue({
      //     identificacion: this.identificacionIdApiDetalleSignal(),
      //   });
      // }
    }
    this.formularioContacto.patchValue({
      tipo_persona: valorPersonaTipo,
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContacto?.markAsDirty();
    this.formularioContacto?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioContacto.get('ciudad_nombre')?.setValue(null);
        this.formularioContacto.get('ciudad')?.setValue(null);
        this.ciudadSeleccionada = null;
      } else {
        this.ciudadSeleccionada = dato.nombre;
        this.formularioContacto
          .get('ciudad_nombre')
          ?.setValue(`${dato.nombre} - ${dato.estado_nombre}`);
        this.formularioContacto.get('ciudad')?.setValue(dato.id);
      }
    }
    if (campo === 'ciudad_nombre') {
      this.formularioContacto.get('ciudad_nombre')?.setValue(dato);
    }
    if (campo === 'barrio') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
    if (campo === 'nombre2') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContacto.get('numero_identificacion')?.value,
    );
    this.formularioContacto.patchValue({
      digito_verificacion: digito,
    });
  }

  consultarCiudad(event: any) {
    this._ciudadApiServices
      .lista(event?.term ?? '')
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
      )
      .subscribe();
  }

  limpiarCiudad(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContacto.controls['ciudad'].setValue(null);
      this.formularioContacto.controls['ciudad_nombre'].setValue(null);
    }
  }

  private _toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }

  private _iniciarFormulario() {
    this.formularioContacto = this.formBuilder.group(
      {
        numero_identificacion: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[0-9]+$/),
          ]),
        ],
        digito_verificacion: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(1)]),
        ],
        identificacion: ['', Validators.compose([Validators.required])],
        nombre_corto: [
          null,
          Validators.compose([Validators.maxLength(200), Validators.required]),
        ],
        nombre1: [
          null,
          Validators.compose([
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            Validators.maxLength(50),
          ]),
        ],
        nombre2: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            cambiarVacioPorNulo.validar,
          ]),
        ],
        apellido1: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          ]),
        ],
        apellido2: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            cambiarVacioPorNulo.validar,
          ]),
        ],
        direccion: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        correo: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        ciudad_nombre: [''],
        ciudad: [null, Validators.compose([Validators.required])],
        telefono: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        celular: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        tipo_persona: [1, Validators.compose([Validators.required])],
        regimen: [1, Validators.compose([Validators.required])],
        barrio: [null, Validators.compose([Validators.maxLength(200)])],
        precio: [null],
        plazo_pago: [1, Validators.compose([Validators.required])],
        plazo_pago_proveedor: [1],
        asesor: [null],
        cliente: [true],
        proveedor: [false],
        banco_nombre: [''],
        banco: [''],
        empleado: [false],
        numero_cuenta: [
          '',
          [Validators.maxLength(20), cambiarVacioPorNulo.validar],
        ],
        cuenta_banco_clase: [''],
        correo_facturacion_electronica: [
          '',
          [Validators.maxLength(255), cambiarVacioPorNulo.validar],
        ],
      },
      {
        validator: [
          MultiplesEmailValidator.validarCorreos([
            'correo',
            'correo_facturacion_electronica',
          ]),
        ],
      },
    );

    this.formularioContacto
      .get('apellido2')
      ?.valueChanges.subscribe((valor) => {
        if (valor === '') {
          this.formularioContacto.get('apellido2')?.setValue(null);
        }
      });
  }

  submit() {
    if (this.formularioContacto.valid) {
      if (this.formularioContacto.get('tipo_persona')?.value == 2) {
        this.actualizarNombreCorto();
      }
      // if (this.detalle && this.ocultarBtnAtras === false) {
      //   if (this.formularioContacto.get('tipo_persona')?.value == 1) {
      //     this.formularioContacto.patchValue({
      //       nombre1: null,
      //       nombre2: null,
      //       apellido1: null,
      //       apellido2: null,
      //     });
      //   }
      //   this._contactoService
      //     .actualizarDatosContacto(this.detalle, this.formularioContacto.value)
      //     .subscribe((respuesta) => {
      //       this.formularioContacto.patchValue({
      //         numero_identificacion: respuesta.numero_identificacion,
      //         identificacion: respuesta.identificacion_id,
      //         codigo: respuesta.codigo,
      //         nombre_corto: respuesta.nombre_corto,
      //         nombre1: respuesta.nombre1,
      //         nombre2: respuesta.nombre2,
      //         apellido1: respuesta.apellido1,
      //         apellido2: respuesta.apellido2,
      //         ciudad: respuesta.ciudad_id,
      //         ciudad_nombre: respuesta.ciudad_nombre,
      //         direccion: respuesta.direccion,
      //         telefono: respuesta.telefono,
      //         celular: respuesta.celular,
      //         correo: respuesta.correo,
      //         tipo_persona: respuesta.tipo_persona_id,
      //         regimen: respuesta.regimen_id,
      //         barrio: respuesta.barrio,
      //         cliente: respuesta.cliente,
      //         proveedor: respuesta.proveedor,
      //       });
      //       this.alertaService.mensajaExitoso('Se actualizó la información');
      //       this.activatedRoute.queryParams.subscribe((parametro) => {
      //         this.router.navigate(
      //           [`${this._rutas?.detalle}/${respuesta.id}`],
      //           {
      //             queryParams: {
      //               ...parametro,
      //             },
      //           },
      //         );
      //       });
      //       this.changeDetectorRef.detectChanges();
      //     });
      // } else {
      this._contactoService
        .guardarContacto(this.formularioContacto.value)
        .pipe(
          tap((respuesta) => {
            this._contactoApiService.lista('').subscribe();
            this._toggleModal(this.modalNuevoCliente);
          }),
        )
        .subscribe();
      // }
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }

  private _consultarInformacion() {
    zip(
      this._identificacionApiServices.lista(),
      this._regimenApiServices.lista(),
      this._tipoPersonaApiServices.lista(),
      this._plazoPagoApiServices.lista(),
      this._ciudadApiServices.lista(''),
      this._listaPreciosApiServices.lista(),
      this._asesorApiServices.lista(),
      this._cuentaBancoApiServices.lista(),
      this._bancoApiServices.lista(),
    ).subscribe(() => {
      console.log(this._identificacionApiServices.arrIdentificacionesSignal());

      this.filteredIdentificacionSignal = computed(
        () =>
          this._identificacionApiServices
            .arrIdentificacionesSignal()
            .filter(
              (item) => item.tipo_persona === this.filtroIdentificacionSignal(),
            ) || [],
      );
    });
  }

  private _setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioContacto.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  private _iniciarSuscripcionesFormularioContacto() {
    this.formularioContacto
      .get('numero_identificacion')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        if (value !== null) {
          this._validarNumeroIdenficacionExistente();
        }
      });

    this.formularioContacto
      .get('identificacion')!
      .valueChanges.subscribe((value) => {
        this._validarNumeroIdenficacionExistente();
      });
  }

  private _validarNumeroIdenficacionExistente() {
    // if (!this.detalle) {
    this._consultarIdentificacionEnServicio();
    // } else {
    //this._procesarValidacionNumeroIdentificacion();
    // }
  }

  private _procesarValidacionNumeroIdentificacion() {
    if (!this._seHanModificadoDatosDeIdentificacion()) {
      // No hay errores si los datos no han cambiado
      this.formularioContacto.get('numero_identificacion')!.setErrors(null);
      return;
    }

    // Si los datos han cambiado, consulta al servicio
    this._consultarIdentificacionEnServicio();
  }

  private _consultarIdentificacionEnServicio() {
    const identificacionId = parseInt(
      this.formularioContacto.get('identificacion')?.value,
    );
    const numeroIdentificacion = this.formularioContacto.get(
      'numero_identificacion',
    )?.value;

    if (!identificacionId || !numeroIdentificacion) {
      return; // Salir si no hay valores para validar
    }

    this._contactoService
      .validarNumeroIdentificacion({
        identificacion_id: identificacionId,
        numero_identificacion: numeroIdentificacion,
      })
      .subscribe({
        next: (respuesta) => {
          this._actualizarErroresNumeroIdentificacion(respuesta.validacion);
        },
      });
  }

  private _seHanModificadoDatosDeIdentificacion() {
    const numeroIdentificacionCambio =
      parseInt(this.informacionContacto.numero_identificacion) !==
      parseInt(this.formularioContacto.get('numero_identificacion')?.value);

    const identificacionIdCambio =
      parseInt(this.informacionContacto.identificacion_id) !==
      parseInt(this.formularioContacto.get('identificacion')?.value);

    return numeroIdentificacionCambio || identificacionIdCambio;
  }

  private _actualizarErroresNumeroIdentificacion(esValido: boolean) {
    const errores: { numeroIdentificacionExistente: boolean } | null = esValido
      ? { numeroIdentificacionExistente: true }
      : null;

    this.formularioContacto.get('numero_identificacion')!.setErrors(errores);
    this.formularioContacto.get('numero_identificacion')!.markAsTouched();
  }

  autocompletar() {
    const numeroIdentificacion = this.formularioContacto.get(
      'numero_identificacion',
    )?.value;
    const tipoidentificacion =
      this.formularioContacto.get('identificacion')?.value;

    this._contactoService
      .autocompletar({
        nit: numeroIdentificacion,
        identificacion_id: parseInt(tipoidentificacion),
      })
      .subscribe({
        next: (respuesta) => {
          if (respuesta.encontrado) {
            if (this.formularioContacto.get('tipo_persona')?.value === 2) {
              this.formularioContacto.patchValue({
                nombre1: respuesta.nombre,
                correo_facturacion_electronica: respuesta.correo,
              });
            } else {
              this.formularioContacto.patchValue({
                nombre_corto: respuesta.nombre,
                correo: respuesta.correo,
                correo_facturacion_electronica: respuesta.correo,
              });
            }
          }
        },
      });
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioContacto.get('nombre1')?.value;
    const nombre2 = this.formularioContacto.get('nombre2')?.value;
    const apellido1 = this.formularioContacto.get('apellido1')?.value;
    const apellido2 = this.formularioContacto.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioContacto
      .get('nombre_corto')
      ?.patchValue(nombreCorto, { emitEvent: false });
  }
}
