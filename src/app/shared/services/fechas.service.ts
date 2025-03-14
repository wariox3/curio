import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechasService {
  meses = {
    es: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  };


  obtenerPrimerDiaDelMes(date: Date): string {
    // Obtener el primer día del mes
    const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);

    // Formatear la fecha en "año-mes-dia"
    const primerDiaFormateado = primerDia.toISOString().split('T')[0];
    return primerDiaFormateado;
  }

  obtenerUltimoDiaDelMes(date: Date): string {
    // Obtener el primer día del próximo mes
    const primerDiaDelSiguienteMes = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
    );

    // Restar un día al primer día del próximo mes para obtener el último día del mes actual
    const ultimoDia = new Date(primerDiaDelSiguienteMes.getTime() - 1);
    ultimoDia.setDate(ultimoDia.getDate() - 1); // Retroceder al último día del mes actual

    // Formatear la fecha en "año-mes-dia"
    const ultimoDiaFormateado = ultimoDia.toISOString().split('T')[0];
    return ultimoDiaFormateado;
  }

  obtenerPrimerDiaDelMesSiguiente(): string {
    const fechaActual = new Date();
    // Obtenemos el mes actual
    const mesActual = fechaActual.getMonth();

    // Incrementamos el mes para obtener el mes siguiente
    const mesSiguiente = mesActual + 1;

    // Configuramos la fecha para el primer día del mes siguiente
    const primerDiaDelMesSiguiente = new Date(
      fechaActual.getFullYear(),
      mesSiguiente,
      1,
    );

    // Obtenemos los componentes de la fecha (año, mes y día)
    const año = primerDiaDelMesSiguiente.getFullYear();
    const mes = String(primerDiaDelMesSiguiente.getMonth() + 1).padStart(
      2,
      '0',
    ); // Agregamos ceros iniciales si el mes es menor a 10
    const dia = String(primerDiaDelMesSiguiente.getDate()).padStart(2, '0'); // Agregamos ceros iniciales si el día es menor a 10

    // Retornamos la fecha en formato "año-mes-dia"
    return `${año}-${mes}-${dia}`;
  }

  obtenerRangoFechaActual() {
    // let resultado = '';
    // this.store
    //   .select(obtenerUsuarioidioma)
    //   .pipe(
    //     tap((idioma) => {
    //       let arrMeses = [];
    //       if (idioma == 'es') {
    //         arrMeses = this.meses.es;
    //       } else {
    //         arrMeses = this.meses.en;
    //       }
    //       const fechaActual = new Date();
    //       const primerDiaDelMes = new Date(
    //         fechaActual.getFullYear(),
    //         fechaActual.getMonth(),
    //         1,
    //       );

    //       const diaActual = fechaActual.getDate();
    //       const primerDia = primerDiaDelMes.getDate();
    //       const mesActual = arrMeses[fechaActual.getMonth() - 1];
    //       const anioActual = fechaActual.getFullYear();

    //       resultado = `del ${primerDia} al ${diaActual} de ${mesActual} de ${anioActual}.`;
    //     }),
    //   )
    //   .subscribe();
    // return resultado;
  }

  obtenerResumenMesHastaFecha() {
    // return this.store.select(obtenerUsuarioidioma).pipe(
    //   map((idioma) => {
    //     let arrMeses = [];
    //     if (idioma == 'es') {
    //       arrMeses = this.meses.es;
    //     } else {
    //       arrMeses = this.meses.en;
    //     }

    //     const fechaActual = new Date();
    //     const primerDiaDelMes = new Date(
    //       fechaActual.getFullYear(),
    //       fechaActual.getMonth(),
    //       1,
    //     );

    //     const diaActual = fechaActual.getDate();
    //     const primerDia = primerDiaDelMes.getDate();
    //     const mesActual = arrMeses[fechaActual.getMonth() - 1];
    //     const anioActual = fechaActual.getFullYear();

    //     let mensaje: string;
    //     if (idioma === 'es') {
    //       mensaje = `Resumen del mes hasta la fecha ${primerDia} al ${diaActual} de ${mesActual} de ${anioActual}.`;
    //     } else {
    //       mensaje = `Month-to-date Summary ${mesActual} ${primerDia} - ${diaActual}, ${anioActual}.`;
    //     }

    //     return mensaje;
    //   }),
    // );
  }

  getFechaVencimientoInicial() {
    const fechaActual = new Date();
    const fullAnio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;

    return `${fullAnio}-${mes.toString().padStart(2, '0')}-${fechaActual
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  obtenerFechaActualFormateada(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso sumamos 1
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
  }

  obtenerAnioActual():string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    return `${anio}`;
  }
}
