import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {ThreeSupportService} from "../services/three-support.service";

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements AfterViewInit {
  @ViewChild('main') canvas: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize')
  resize() {
    this.threeSupportService.resize();
  }

  constructor(private threeSupportService: ThreeSupportService) {}

  ngAfterViewInit() {
    this.threeSupportService.init(this.canvas.nativeElement);
  }
}
