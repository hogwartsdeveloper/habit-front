import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-modal-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss'],
})
export class ModalBaseComponent {
  @Input({ required: true }) title: string = '';
  @Input() actives: TemplateRef<HTMLElement>;
}
