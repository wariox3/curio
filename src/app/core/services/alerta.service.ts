import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {

  //TODO: colores del core de tailwindcss en su tono 500 
  colorRed = 'oklch(0.637 0.237 25.331)'
  colorBlue = 'oklch(0.685 0.169 237.323)'
  colorGris = 'oklch(0.551 0.027 264.364)'

  constructor() {}

  mensajeError(title: string, text: string) {
    Swal.fire({
      title,
      html: text,
      icon: 'error',
      position: 'bottom-right',
      toast: true,
      timer: 20000,
      showConfirmButton: true,
      timerProgressBar: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: this.colorRed,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  async mensajaExitoso(titulo: string | null, text: string) {
    let title = 'EXITOSO';
    if (title) {
      title = titulo;
    }
    return await Swal.fire({
      title,
      html: text,
      icon: 'success',
      position: 'bottom-right',
      toast: true,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  async mensajaEspera(
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
  ) {
    return await (Swal.fire({
      html: text,
      icon,
      timerProgressBar: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }),
    Swal.showLoading());
  }

  mensajeValidacion(
    title: string,
    html: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
  ) {
    return Swal.fire({
      title,
      icon,
      html,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Thumbs down',
      confirmButtonText: 'Aceptar',
      confirmButtonAriaLabel: 'aceptar',
      confirmButtonColor: this.colorBlue,
    });
  }

  async mensajeEliminarEmpresa(
    empresaNombre: string | null,
    title: string,
    html: string,
    inputLabel: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) {
    const mensaje = await Swal.fire({
      title,
      icon: 'warning',
      html,
      cancelButtonText,
      confirmButtonText,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonColor: this.colorRed,
      input: 'text',
      inputLabel: `${inputLabel}${empresaNombre}`,
      didOpen: () => {
        // Deshabilitar el botón de confirmar
        Swal.getConfirmButton()?.setAttribute('disabled', 'true');
        // Configurar el foco del input
        const input = Swal.getInput();
        if (input) {
          input.focus(); // Establecer el foco en el input
          input.oninput = () => {
            if (Swal.getInput()?.value === empresaNombre) {
              Swal.getConfirmButton()?.removeAttribute('disabled');
            } else {
              Swal.getConfirmButton()?.setAttribute('disabled', 'true');
            }
          };
        }
      },
    });
    return mensaje;
  }

  cerrarMensajes() {
    return Swal.close();
  }

  mensajeVisible() {
    return Swal.isVisible();
  }

  async mensajaContactoLandinpage(text: string) {
    return await Swal.fire({
      html: text,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }).then(() => {
      window.location.href = '/';
    });
  }

  async confirmar(configuracion: {
    titulo: string;
    texto: string;
    textoBotonCofirmacion: string;
  }) {
    return await Swal.fire({
      title: configuracion.titulo,
      icon: 'warning',
      text: configuracion.texto,
      showCancelButton: true,
      confirmButtonColor: this.colorRed,
      cancelButtonColor: this.colorGris,
      confirmButtonText: configuracion.textoBotonCofirmacion,
      cancelButtonText: 'Cancelar',
    });
  }

  confirmarSinReversa(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: '¿Está seguro de que desea aprobar el registro?',
        text: ' Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.colorBlue,
        cancelButtonColor: this.colorRed,
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }

  anularSinReversa(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: '¿Está seguro de que desea anular el registro?',
        text: ' Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.colorBlue,
        cancelButtonColor: this.colorRed,
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }

  confimarConfigracionPrederminada(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: 'Configuración rapida',
        text: ' Establece los valores predeterminados y haz que el sistema funcione al instante.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: this.colorBlue,
        cancelButtonColor: this.colorRed,
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }
}
