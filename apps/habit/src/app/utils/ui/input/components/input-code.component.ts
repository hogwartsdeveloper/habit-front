import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { KeyEnum } from '../../keyboard/types/key.enum';
import { IInput } from '../models/input.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-code',
  templateUrl: 'input-code.component.html',
  styleUrls: ['./input-code.component.scss'],
})
export class InputCodeComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) config: IInput;
  @Input({ required: true }) form: FormGroup;

  @ViewChildren('inputs') inputs: QueryList<ElementRef<HTMLInputElement>>;
  listeners: any[] = [];
  formChange?: Subscription;

  ngAfterViewInit() {
    this.listenForm();
    this.inputs.forEach((input, key) => {
      const inputEl = input.nativeElement;

      const keyDownListener = (event) => {
        switch (event.code) {
          case KeyEnum.Backspace:
            const target = event.target as HTMLInputElement;
            if (target.value !== '') return;

            this.inputs.get(Math.max(0, key - 1))?.nativeElement.focus();
        }
      };

      const inputListener = (event: any) => {
        const [first, ...rest] = event.target?.value;
        event.target.value = first ?? '';

        const last = key === this.inputs.length - 1;
        const didInsertContent = first != null;
        const input = this.inputs.get(key + 1)?.nativeElement;

        if (didInsertContent && !last) {
          if (!input) return;

          input.focus();
          input.value = rest.join('');
          input.dispatchEvent(new Event('input'));
        }

        if (last) {
          this.patchValue();
        }
      };

      inputEl.addEventListener('keydown', keyDownListener);
      inputEl.addEventListener('input', inputListener);
      this.listeners.push([keyDownListener, inputListener]);
    });
  }

  listenForm() {
    this.formChange = this.form
      .get(this.config.fName)
      ?.valueChanges.subscribe((value) => {
        console.log(value);
        this.inputs.forEach((input, index) => {
          input.nativeElement.value = value;
        });
      });
  }

  patchValue() {
    this.formChange?.unsubscribe();
    const code = this.inputs.map((el) => el.nativeElement.value).join('');
    if (code.length === this.inputs.length) {
      this.form.get(this.config.fName)?.patchValue(code);
    }

    this.listenForm();
  }

  ngOnDestroy() {
    this.inputs.forEach((input, index) => {
      input.nativeElement.removeEventListener(
        'keydown',
        this.listeners[index][0]
      );
      input.nativeElement.removeEventListener(
        'input',
        this.listeners[index][1]
      );
    });

    this.formChange?.unsubscribe();
  }
}
