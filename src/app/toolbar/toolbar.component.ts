import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthorModalComponent } from '../author-modal/author-modal.component';
import { AuthorType } from '../models/author.model';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [MatDialogModule, RouterLink, MatButtonModule, NgIf, AsyncPipe],
  standalone: true,
})
export class ToolbarComponent {
  isAuth$: BehaviorSubject<boolean>;
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuth$ = this.authService.isAuth$;
  }

  openLogin(type: AuthorType = 'signIn') {
    this.dialog.open(AuthorModalComponent, {
      width: '400px',
      height: type === 'signIn' ? '500px' : '650px',
      panelClass: 'noBackground',
      data: {
        type,
      },
    });
  }

  goToMainPage() {
    this.authService.isAuth$.next(false);
    this.router.navigate(['/']);
  }
}
