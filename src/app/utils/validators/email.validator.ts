import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';

import { UserService } from '../../modules/user/services/user.service';

export function emailValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => userService.checkEmail(value)),
      map((isAvailable) => (isAvailable ? null : { email: true })),
      catchError(() => of(null)),
      take(1)
    );
  };
}
