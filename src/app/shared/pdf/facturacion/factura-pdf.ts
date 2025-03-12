import { Contenedor } from '@interfaces/contenedores.interface';
import {
  DocumentoFactura,
  DocumentoFacturaDetalleRespuesta,
} from '@interfaces/facturas.interface';
import jsPDF from 'jspdf';
import { FacturaReduxService } from 'src/app/pages/facturacion/services/factura-redux.service';

export class FacturaPdf {
  protected pdf = new jsPDF({
    format: [80, 297], // Establece un ancho de 80mm (mpresora POS) y altura flexible
  });

  constructor() {}

  generarPosPdf(contenedor: Contenedor, factura: DocumentoFactura) {
    // Encabezado
    this.pdf.setFontSize(12);
    this.pdf.text(contenedor.nombre, 40, 10, { align: 'center' });
    this.pdf.setFontSize(8);
    this.pdf.text('Teléfono: 600 123 456', 40, 20, { align: 'center' });
    this.pdf.text('Email: contacto@loremipsum.com', 40, 25, {
      align: 'center',
    });
    this.pdf.text('Régimen: Responsable de IVA', 40, 30, { align: 'center' });
    this.pdf.text('Pre-factura - Sin valor fiscal', 40, 35, {
      align: 'center',
    });

    // Cliente
    this.pdf.setFontSize(10);
    this.pdf.text(factura.contacto_nombre_corto, 40, 45, {
      align: 'center',
    });
    this.pdf.text('CC', 40, 50, {
      align: 'center',
    });
    this.pdf.text(`${factura.contacto_numero_identificacion}`, 40, 55, {
      align: 'center',
    });

    // Detalle de productos
    this.pdf.setFontSize(10);
    this.pdf.text('Detalle de productos', 5, 60);
    this.pdf.line(5, 62, 75, 62);

    //iteracion items
    let ejeY = 70;
    const maxWidth = 30; // Ancho máximo para el nombre del producto
    factura.detalles.map((item) => {
      const lineasNombre = this._dividirTextoPorAncho(
        this.pdf,
        item.item_nombre,
        maxWidth
      );

      this.pdf.text(lineasNombre, 5, ejeY);
      this.pdf.text(item.cantidad.toString(), 40, ejeY);
      this.pdf.text(item.precio.toString(), 60, ejeY);
      ejeY += 5;
    });

    //Totales

    const pageWidth = this.pdf.internal.pageSize.width;
    const margenDerecho = 10; // Margen desde el borde derecho

    this.pdf.setFont(undefined, 'bold');
    this.pdf.text(
      `Subtotal: ${factura.subtotal}`,
      pageWidth -
        margenDerecho -
        this.pdf.getTextWidth(`Subtotal: ${factura.subtotal}`),
      (ejeY += 5)
    );

    const arrImpuesto = this._ImpuestosFacturaActiva(factura.detalles);
    for (const key in arrImpuesto) {
      this.pdf.text(
        `${arrImpuesto[key].impuesto}: ${arrImpuesto[key].total}`,
        pageWidth -
          margenDerecho -
          this.pdf.getTextWidth(
            `${arrImpuesto[key].impuesto}: ${arrImpuesto[key].total}`
          ),
        (ejeY += 5)
      );
    }
    this.pdf.text(
      `Total: ${factura.total}`,
      pageWidth -
        margenDerecho -
        this.pdf.getTextWidth(`Total: ${factura.total}`),
      (ejeY += 5)
    );

    // Pie de página
    this.pdf.setFontSize(8);
    this.pdf.setFont(undefined, 'nomal');
    this.pdf.text('Soluciones Lorem Ipsum S.A.', 40, (ejeY += 5), {
      align: 'center',
    });
    this.pdf.text('NIT 900.000.000-0', 40, (ejeY += 5), { align: 'center' });
    this.pdf.text('loremipsum.com/pos', 40, (ejeY += 5), { align: 'center' });

    // preview sin descarga 
    //this.pdf.output('dataurlnewwindow');

    // Para descargar directamente
    this.pdf.save('factura_simulada_pos.pdf');
  }

  private _dividirTextoPorAncho(pdf, texto, maxWidth) {
    const palabras = texto.split(' ');
    let linea = '';
    const lineas = [];

    palabras.forEach((palabra) => {
      const testLinea = linea + (linea ? ' ' : '') + palabra;
      const testWidth = pdf.getTextWidth(testLinea);

      if (testWidth <= maxWidth) {
        linea = testLinea;
      } else {
        lineas.push(linea);
        linea = palabra;
      }
    });

    lineas.push(linea); // Añadir la última línea
    return lineas;
  }

  private _ImpuestosFacturaActiva(
    detalles: DocumentoFacturaDetalleRespuesta[]
  ): Record<string, { impuesto: string; total: number }> {
    let acumulador: Record<string, { impuesto: string; total: number }> = {};

    detalles.forEach((detalle) => {
      if (detalle.impuestos?.length) {
        detalle.impuestos.forEach((impuesto) => {
          const clave = impuesto.nombre_extendido || 'Desconocido';
          const total = impuesto.total || 0;

          if (!acumulador[clave]) {
            acumulador[clave] = { impuesto: clave, total: 0 };
          }

          acumulador[clave].total += total;
        });
      }
    });

    return acumulador;
  }
}
