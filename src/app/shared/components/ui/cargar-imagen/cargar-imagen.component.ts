import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { KTModal } from '@metronic/components/modal/modal';

@Component({
  selector: 'app-cargar-imagen',
  templateUrl: './cargar-imagen.component.html',
  styleUrls: ['./cargar-imagen.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent],
})
export class CargarImagenComponent implements OnChanges {

  private sanitizer = inject(DomSanitizer)
  private _changeDetectorRef = inject(ChangeDetectorRef);

  public imagenMuyGrande = false
  modalRef: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  base64: string | ArrayBuffer = '';
  visualizarRemoverImagen = false;
  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  inputNombre: ElementRef<HTMLInputElement>;
  @ViewChild('modalFormulario') modalFormulario!: ElementRef;
  @ViewChild('fileInput') fileInput !: ElementRef<HTMLInputElement>
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @Output() eliminarLogo: EventEmitter<any> = new EventEmitter();
  @Input() recibirImagen: string | null = '';
  @Input() width: string = '160px';
  @Input() height: string = '160px';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recibirImagen'].currentValue) {
      if (changes['recibirImagen'].currentValue.includes('defecto')) {
        this.visualizarRemoverImagen = false;
      } else {
        this.visualizarRemoverImagen = true;
      }
    }
    this._changeDetectorRef.detectChanges()
  }

  archivoSeleccionado(event: any) {
    this.visualizarRemoverImagen = true;
    if (event.target.files.length > 0) {
      this._toggleModal(this.modalFormulario);
      this.imageChangedEvent = event;

      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.srcResult = e.target.result;
        };
        reader.readAsDataURL(this.imageChangedEvent.target.files[0]);
      }
      event.target.files = null;
      this._changeDetectorRef.detectChanges();
    }
  }

  removerArchivoSeleccionado() {
    if (this.recibirImagen?.includes('defecto')) {
      this.visualizarRemoverImagen = false;
      this._changeDetectorRef.detectChanges()
    }
    this.base64 = '';
    return this.eliminarLogo.emit(true);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    var reader = new FileReader();
    if (event.blob) {
      if (event.blob.size >= 2012490) {
        this.imagenMuyGrande = true
      } else {
        this.imagenMuyGrande = false
      }
      const convertedBlob = event.blob.slice(0, event.blob.size, 'image/jpeg');
      reader.readAsDataURL(convertedBlob);
      reader.onloadend = () => {
        if (reader.result) {
          this.base64 = reader.result;
        }
      };
    }

    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl
      );
    }
  }

  imageLoaded(image: LoadedImage) {

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
  }

  emitirBase64() {
    this.fileInput.nativeElement.value = '';
      this._toggleModal(this.modalFormulario);
    this._changeDetectorRef.detectChanges()
    return this.dataFormulario.emit(this.base64);
  }

  cerrarModal() {
    this.fileInput.nativeElement.value = '';
    this.base64 = ''
    this.visualizarRemoverImagen = false
    this.modalRef.dismiss('Cross click')
  }

  private _toggleModal(modalRef: ElementRef): void {
    KTModal.getInstance(modalRef.nativeElement)?.toggle();
  }



}
