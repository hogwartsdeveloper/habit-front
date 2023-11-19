import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { inject } from '@angular/core';
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

export function emailExistValidator(): AsyncValidatorFn {
  const userService = inject(UserService);

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => userService.checkEmailExist(value)),
      map(() => null),
      catchError((err) => of(err.error.message)),
      take(1)
    );
  };
}
