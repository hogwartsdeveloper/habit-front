import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthorModalComponent } from '../auth/author-modal/author-modal.component';
import { AuthorType } from '../auth/models/author.model';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ThreeSupportService } from '../services/three-support.service';
import { ButtonComponent } from '../utils/ui/button/button.component';
import { IUser } from '../pages/user/model/user.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  ],
  standalone: true,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isAuth$: BehaviorSubject<boolean>;
  user: IUser;
  destroy$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private threeSupportService: ThreeSupportService,
    private translateService: TranslateService
  ) {
    this.isAuth$ = this.authService.isAuth$;
  }

  ngOnInit() {
    this.translateService.use('kz');
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));
  }

  openLogin(type: AuthorType = 'signIn') {
    this.dialog
      .open(AuthorModalComponent, {
        width: '400px',
        height: type === 'signIn' ? '500px' : '650px',
        panelClass: 'noBackground',
        data: {
          type,
        },
      })
      .beforeClosed()
      .subscribe(() => this.threeSupportService.stopAnimation$.next(false));
  }

  goToMainPage() {
    this.authService.isAuth$.next(false);
    this.threeSupportService.stopAnimation$.next(false);
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
