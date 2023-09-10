import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { AuthService } from '../../auth/services/auth.service';
import { IUser } from '../../pages/user/model/user.interface';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { show } from '../../utils/animations/show.animation';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    NzSelectModule,
    NgForOf,
    NgIf,
    FormsModule,
  ],
  animations: [show],
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  user: IUser;
  selectedLang;
  langs = [
    { id: 'kz', name: 'Kazakh' },
    { id: 'en', name: 'English' },
    { id: 'ru', name: 'Russian' },
  ];
  showMenu = false;
  openedSelect = false;
  destroy$ = new Subject();

  @HostListener('mousemove')
  onMenu() {
    this.showMenu = true;
  }

  @HostListener('mouseleave')
  offMenu() {
    if (!this.openedSelect) {
      this.showMenu = false;
    }
  }
  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {}
  ngOnInit() {
    this.selectedLang = this.translateService.currentLang;
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));

    this.translateService.onLangChange.pipe(take(1)).subscribe((lang) => {
      this.selectedLang = lang.lang;
    });
  }

  selectLang(event) {
    this.translateService.use(event);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
