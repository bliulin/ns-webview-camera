import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

const IBAN = require('iban');

export class CustomValidators {
    public static validateIBAN(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const candidate = control.value;
            const isIban: boolean = IBAN.isValid(candidate);
            return !isIban ? { validIBAN: { value: candidate } } : null;
        };
    }

    public static validateCUI(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            let $cif = control.value;

            $cif = $cif.trim();
            $cif = $cif.replace(/ /g, '');

            if (isNaN($cif)) {
                $cif = $cif.toUpperCase();

                if ($cif.substring(0, 2) === 'RO') {
                    $cif = $cif.substring(2);
                }
            }

            if ($cif.length > 10 || $cif.length < 2) {
                return { validCUI: { value: control.value } };
            }
            $cif = parseInt($cif, 10);

            const pattern = /^\d+$/;
            if (!pattern.test($cif)) {
                return { validCUI: { value: control.value } };
            }

            let $v = 753217532;

            const $c1 = $cif % 10;
            $cif = Math.floor($cif / 10);

            let $t = 0;
            while ($cif > 0) {
                $t += ($cif % 10) * ($v % 10);
                $cif = Math.floor($cif / 10);
                $v = Math.floor($v / 10);
            }

            let $c2 = ($t * 10) % 11;

            if ($c2 === 10) {
                $c2 = 0;
            }
            return !($c1 === $c2) ? { validCUI: { value: control.value } } : null;
        };
    }

    public static dateMinimum(min: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == null) {
                return null;
            }

            const controlDate = moment(control.value, 'YYYY-MM-DD');

            if (!controlDate.isValid()) {
                return null;
            }

            const validationDate = moment(min);

            return controlDate.isSameOrAfter(validationDate)
                ? null
                : {
                      dateMinimum: {
                          minimum: validationDate.format('YYYY-MM-DD'),
                          actual: controlDate.format('YYYY-MM-DD')
                      }
                  };
        };
    }
    public static dateMaximum(max: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == null) {
                return null;
            }

            const controlDate = moment(control.value, 'YYYY-MM-DD');

            if (!controlDate.isValid()) {
                return null;
            }

            const validationDate = moment(max);

            return controlDate.isSameOrBefore(validationDate)
                ? null
                : {
                      dateMaximum: {
                          maximum: validationDate.format('YYYY-MM-DD'),
                          actual: controlDate.format('YYYY-MM-DD')
                      }
                  };
        };
    }
}
