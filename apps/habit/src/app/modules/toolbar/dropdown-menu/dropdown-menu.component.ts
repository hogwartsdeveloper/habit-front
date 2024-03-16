import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { of, Subject, switchMap, take } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { AuthService } from '../../auth/services/auth.service';
import { show } from '../../../utils/animations/show.animation';
import { User } from '../../user/model/user';
import { UserService } from '../../user/services/user.service';
import { AvatarComponent, ButtonComponent } from 'ui';
import { FileService } from '../../../services/file.service';

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
  userImg: string;
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
    private readonly fileService: FileService
  ) {}

  ngOnInit() {
    this.userService.user$
      .pipe(
        switchMap((user) => {
          if (!user) {
            return of(null);
          }
          this.user = user;

          return user.imageUrl
            ? this.fileService.getFile(user.imageUrl)
            : of(null);
        }),
        take(1)
      )
      .subscribe(async (file) => {
        if (file) {
          this.userImg = await this.fileService.convertFileToBase64(file);
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
