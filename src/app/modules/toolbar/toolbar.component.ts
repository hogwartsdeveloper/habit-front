import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Subject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthModalComponent } from '../auth/author-modal/auth-modal.component';
import { AuthorType } from '../auth/models/author.model';
import { ThreeSupportService } from '../../services/three-support.service';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { DropdownMenuComponent } from './dropdown-menu/dropdown-menu.component';
import { User } from '../user/model/user';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    MatDialogModule,
    RouterLink,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    ButtonComponent,
    TranslateModule,
    DropdownMenuComponent,
  ],
  standalone: true,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  user$: BehaviorSubject<User | null>;
  destroy$ = new Subject();

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly threeSupportService: ThreeSupportService,
    private readonly translateService: TranslateService
  ) {
    this.user$ = this.userService.user$;
  }

  ngOnInit() {
    this.translateService.use('en');
  }

  openLogin(type: AuthorType = 'signIn') {
    this.dialog
      .open(AuthModalComponent, {
        width: '400px',
        height: type === 'signIn' ? '350px' : '500px',
        panelClass: 'noBackground',
        data: {
          type,
        },
      })
      .beforeClosed()
      .subscribe(() => this.threeSupportService.stopAnimation$.next(false));
  }

  goToMainPage() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
