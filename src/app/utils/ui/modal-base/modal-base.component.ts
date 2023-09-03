import { Component, Input, TemplateRef } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-modal-base',
  standalone: true,
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.scss'],
  imports: [NgTemplateOutlet, NgIf],
})
export class ModalBaseComponent {
  @Input({ required: true }) title: string = '';
  @Input() actives: TemplateRef<HTMLElement>;
}
