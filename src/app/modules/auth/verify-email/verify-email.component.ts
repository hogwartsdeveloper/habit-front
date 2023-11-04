import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IInput } from '../../../utils/ui/input/models/input.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  config = signal<IInput>({
    title: 'Enter code',
    required: true,
    type: 'code',
    fName: 'code',
  });

  form = signal<FormGroup>(
    new FormGroup({
      code: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
    })
  );

  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.form()
      .get(this.config().fName)
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log(value);
      });
  }
}
