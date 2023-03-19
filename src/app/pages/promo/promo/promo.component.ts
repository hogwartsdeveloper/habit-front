import {Component, HostListener, OnInit} from '@angular/core';
import {ThreeSupportService} from "../services/three-support.service";

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements OnInit {
  @HostListener('window:resize')
  resize() {
    this.threeSupportService.resize();
  }

  constructor(private threeSupportService: ThreeSupportService) {}

  ngOnInit() {
    this.threeSupportService.init();
  }
}
