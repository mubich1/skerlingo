import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorsService {
  constructor() {}

  /**
   * Checks if value is a valid number
   */
  number(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      if (!isNaN(value)) {
        return null;
      }

      return { number: { value: control.value } };
    };
  }

  /**
   * Checks if value is a valid integer number
   */
  numberInteger(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const valueNbr = value * 1;
      const valueInt = Math.round(valueNbr);

      if (!isNaN(valueNbr) && valueInt === valueNbr) {
        return null;
      }

      return { numberInteger: { value: control.value } };
    };
  }
}
