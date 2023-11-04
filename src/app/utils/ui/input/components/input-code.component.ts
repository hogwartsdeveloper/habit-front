import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { KeyEnum } from '../../keyboard/types/key.enum';

@Component({
  selector: 'app-input-code',
  templateUrl: 'input-code.component.html',
  styleUrls: ['./input-code.component.scss'],
})
export class InputCodeComponent implements AfterViewInit {
  @ViewChildren('inputs') inputs: QueryList<ElementRef<HTMLInputElement>>;

  ngAfterViewInit() {
    this.inputs.forEach((input, key) => {
      const inputEl = input.nativeElement;

      inputEl.addEventListener('keydown', (event: any) => {
        switch (event.code) {
          case KeyEnum.Backspace:
            if (event.target.value !== '') return;

            this.inputs.get(Math.max(0, key - 1))?.nativeElement.focus();
        }
      });

      inputEl.addEventListener('input', (event: any) => {
        const [first, ...rest] = event.target?.value;
        event.target.value = first ?? '';

        const last = key === this.inputs.length - 1;
        const didInsertContent = first != null;

        if (didInsertContent && !last) {
          const input = this.inputs.get(key + 1)?.nativeElement;
          if (!input) return;

          input.focus();
          input.value = rest.join('');
          input.dispatchEvent(new Event('input'));
        }
      });
    });
  }
}
