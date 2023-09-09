import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
import { IUser } from '../../pages/user/model/user.interface';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    MatInputModule,
    MatSelectModule,
    NgForOf,
    NgIf,
  ],
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
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));

    this.translateService.onLangChange
      .pipe(take(1))
      .subscribe((lang) => (this.selectedLang = lang.lang));
  }

  selectLang(event) {
    this.translateService.use(event);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
