import { Component, Input } from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'lib-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [NzAvatarModule],
})
export class AvatarComponent {
  @Input({ required: true }) text: string;
  @Input({ required: true }) src: string;
  @Input() size: NzSizeLDSType | number = 'default';
}
