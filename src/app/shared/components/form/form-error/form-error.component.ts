import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

type AngularValidation =
  | 'required'
  | 'min'
  | 'max'
  | 'minlength'
  | 'maxlength'
  | 'email'
  | 'pattern'
  | 'nullValidator';


interface ValidationError {
  validacionTipo: AngularValidation;
  mensaje: string;
  cantidadCaracteres?: number;
}

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;
  @Input() errors: ValidationError[] = [];


}
