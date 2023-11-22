import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzResultStatusType } from 'ng-zorro-antd/result/result.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'lib-result',
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  imports: [NzResultModule, RouterLink],
})
export class ResultComponent {
  @Input({ required: true }) status: NzResultStatusType;
  @Input({ required: true }) title: string;
  @Input({ required: true }) message: string;
}
