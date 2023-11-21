import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IInput } from 'ui';

@Component({
  selector: 'lib-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input({ required: true }) config: IInput;
  @Input({ required: true }) form: FormGroup;

  ngOnInit() {
    this.form.valueChanges.subscribe((value) => {
      console.log(this.form);
    });
  }
}
