import { ElementRef, Injectable, QueryList } from '@angular/core';
import { KeyEnum } from './types/key.enum';

@Injectable()
export class KeyboardService {
  keyAction(
    keys: QueryList<ElementRef<HTMLElement>>,
    code: string,
    action: 'down' | 'up' = 'down'
  ) {
    switch (code) {
      case KeyEnum.W:
      case KeyEnum.A:
      case KeyEnum.S:
      case KeyEnum.D:
        const el = this.searchKey(keys, code);
        if (action === 'down') {
          el?.nativeElement?.classList?.add('active');
          return;
        }

        el?.nativeElement?.classList.remove('active');
    }
  }

  private searchKey(keys: QueryList<ElementRef<HTMLElement>>, code: KeyEnum) {
    return keys.find((key) => key.nativeElement.dataset['id'] === code);
  }
}
