import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 300;

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText) return;

    // Limpiar timeout de ocultar si existe
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Mostrar tooltip con delay
    this.showTimeout = setTimeout(() => {
      this.showTooltip();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Limpiar timeout de mostrar si existe
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // Ocultar tooltip con un pequeño delay para mejor UX
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }

  private showTooltip(): void {
    if (this.tooltipElement) return;

    // Crear elemento tooltip
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip-container');

    // Contenido del tooltip
    const tooltipContent = this.renderer.createElement('div');
    this.renderer.addClass(tooltipContent, 'tooltip-content');
    this.renderer.setProperty(tooltipContent, 'textContent', this.tooltipText);

    // Flecha del tooltip
    const tooltipArrow = this.renderer.createElement('div');
    this.renderer.addClass(tooltipArrow, 'tooltip-arrow');

    // Ensamblar tooltip
    this.renderer.appendChild(this.tooltipElement, tooltipContent);
    this.renderer.appendChild(this.tooltipElement, tooltipArrow);

    // Añadir al body
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Posicionar tooltip
    this.positionTooltip();

    // Animación de entrada
    this.renderer.addClass(this.tooltipElement, 'tooltip-show');
  }

  private hideTooltip(): void {
    if (!this.tooltipElement) return;

    // Animación de salida
    this.renderer.removeClass(this.tooltipElement, 'tooltip-show');
    this.renderer.addClass(this.tooltipElement, 'tooltip-hide');

    // Remover después de la animación
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
    }, 200);
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top + scrollTop - tooltipRect.height - 10;
        left = hostRect.left + scrollLeft + hostRect.width / 2 - tooltipRect.width / 2;
        this.renderer.addClass(this.tooltipElement, 'tooltip-top');
        break;
      case 'bottom':
        top = hostRect.bottom + scrollTop + 10;
        left = hostRect.left + scrollLeft + hostRect.width / 2 - tooltipRect.width / 2;
        this.renderer.addClass(this.tooltipElement, 'tooltip-bottom');
        break;
      case 'left':
        top = hostRect.top + scrollTop + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.left + scrollLeft - tooltipRect.width - 10;
        this.renderer.addClass(this.tooltipElement, 'tooltip-left');
        break;
      case 'right':
        top = hostRect.top + scrollTop + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.right + scrollLeft + 10;
        this.renderer.addClass(this.tooltipElement, 'tooltip-right');
        break;
    }

    // Ajustar si se sale de la pantalla
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 10;
    if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 10;
    if (top < scrollTop) top = scrollTop + 10;
    if (top + tooltipRect.height > scrollTop + viewportHeight)
      top = scrollTop + viewportHeight - tooltipRect.height - 10;

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
  }

  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }
}
