import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'lib-load',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent {
  _isLoading = signal<boolean>(false);
  @Input() set isLoading(value: boolean) {
    this._isLoading.set(value);
  }
}
