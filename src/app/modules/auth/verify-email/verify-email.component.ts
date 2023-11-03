import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IInput } from '../../../utils/ui/input/models/input.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements AfterViewInit {
  config = signal<IInput>({
    title: 'Enter code',
    placeholder: '',
    required: true,
    type: 'password',
    fName: 'code',
  });

  form = signal<FormGroup>(
    new FormGroup({ code: new FormControl(null, Validators.required) })
  );

  @ViewChildren('inputs') inputs: QueryList<ElementRef<HTMLInputElement>>;

  ngAfterViewInit() {
    this.inputs.forEach((input, key) => {
      const inputEl = input.nativeElement;

      inputEl.addEventListener('keyup', () => {
        this.inputs.get(key + 1)?.nativeElement.focus();
      });
    });
  }
}
