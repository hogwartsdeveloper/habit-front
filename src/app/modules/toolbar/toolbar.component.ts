import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthModalComponent } from '../auth/author-modal/auth-modal.component';
import { AuthorType } from '../auth/models/author.model';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ThreeSupportService } from '../../services/three-support.service';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownMenuComponent } from './dropdown-menu/dropdown-menu.component';
import { User } from '../user/model/user';

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
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private threeSupportService: ThreeSupportService,
    private translateService: TranslateService
  ) {
    this.user$ = this.authService.user$;
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
