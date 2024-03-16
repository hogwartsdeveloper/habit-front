import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {NzSelectModule} from 'ng-zorro-antd/select';

import {AuthService} from '../../auth/services/auth.service';
import {show} from '../../../utils/animations/show.animation';
import {User} from '../../user/model/user';
import {UserService} from '../../user/services/user.service';
import {AvatarComponent, ButtonComponent} from 'ui';

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
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  ngOnInit() {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
