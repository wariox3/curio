import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [],
  template: `
    <div>
      @if(label){
        <label class="block text-sm font-medium text-gray-700">
          {{ label }}
        </label>
      }
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="text"
          [placeholder]="placeholder"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [disabled]="disabled"
          class="input pl-7"
          inputmode="numeric"
        />
      </div>
      @if (shouldShowErrors()) {
        @for (error of getErrors(); track $index) {
          <p class="text-sm text-red-600 mt-1">
            {{ error }}
          </p>
        }
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true,
    },
  ],
})
export class CurrencyInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '0';
  @Input() errors: { [key: string]: string } = {};
  @Input() disabled: boolean = false;
  @Input() invalid: boolean | undefined = false;
  @Input() dirty: boolean | undefined = false;
  @Input() touched: boolean | undefined = false;
  @Input() control: AbstractControl | null = null;

  @Output() blurEvent = new EventEmitter<void>();

  private _value: number = 0;
  displayValue: string = '';
  private isFocused: boolean = false;
  
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this._value = value || 0;
    this.updateDisplayValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    
    // Remover todo excepto números
    const numericValue = rawValue.replace(/[^\d]/g, '');
    
    if (numericValue === '') {
      this._value = 0;
      this.displayValue = '';
    } else {
      this._value = parseInt(numericValue, 10);
      this.updateDisplayValue();
    }
    
    this.onChange(this._value);
    this.dirty = true;
  }

  onFocus(): void {
    this.isFocused = true;
    // En foco, mostrar solo el número sin formato para facilitar edición
    this.displayValue = this._value > 0 ? this._value.toString() : '';
  }

  onBlur(): void {
    this.isFocused = false;
    this.updateDisplayValue();
    this.onTouched();
    this.blurEvent.emit();
  }

  private updateDisplayValue(): void {
    if (this.isFocused) {
      return; // No formatear mientras está en foco
    }
    
    if (this._value === 0) {
      this.displayValue = '';
      return;
    }
    
    // Formatear con separadores de miles
    this.displayValue = new Intl.NumberFormat('es-CO').format(this._value);
  }

  shouldShowErrors(): boolean {
    if (this.control) {
      return this.control.invalid && (this.control.dirty || this.control.touched);
    }
    return this.invalid === true && (this.dirty === true || this.touched === true);
  }

  getErrors(): string[] {
    if (!this.errors || !this.control?.errors) return [];

    const activeErrors: string[] = [];
    Object.keys(this.control.errors).forEach(errorKey => {
      const normalizedKey = this.normalizeErrorKey(errorKey);
      if (this.errors[normalizedKey]) {
        activeErrors.push(this.errors[normalizedKey]);
      }
    });

    return activeErrors;
  }

  private normalizeErrorKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      minlength: 'minLength',
      maxlength: 'maxLength',
      required: 'required',
      pattern: 'pattern',
      min: 'min',
      max: 'max',
    };
    return keyMap[key] || key;
  }
}
