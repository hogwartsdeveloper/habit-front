import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { en_US, kk_KZ, NzI18nService, ru_RU } from 'ng-zorro-antd/i18n';

import { AuthService } from '../../auth/services/auth.service';
import { show } from '../../../utils/animations/show.animation';
import { User } from '../../user/model/user';
import { UserService } from '../../user/services/user.service';
import { AvatarComponent, ButtonComponent } from 'ui';

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
    AvatarComponent,
  ],
  animations: [show],
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  user: User;
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
    private readonly i18n: NzI18nService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {}
  ngOnInit() {
    this.selectedLang = this.translateService.currentLang;
    this.nzLocalChange(this.selectedLang);
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    this.translateService.onLangChange.pipe(take(1)).subscribe((lang) => {
      this.selectedLang = lang.lang;
      this.nzLocalChange(this.selectedLang);
    });
  }

  selectLang(event) {
    this.translateService.use(event);
  }

  nzLocalChange(lang: 'kz' | 'en' | 'ru') {
    switch (lang) {
      case 'kz':
        this.i18n.setLocale(kk_KZ);
        break;
      case 'en':
        this.i18n.setLocale(en_US);
        break;
      case 'ru':
        this.i18n.setLocale(ru_RU);
        break;
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
