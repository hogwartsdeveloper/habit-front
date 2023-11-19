import { Component, Input } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [NzAvatarModule],
})
export class AvatarComponent {
  @Input() text: string = '';
  @Input() src: string = '';
  @Input() size: NzSizeLDSType | number = 'default';
}
