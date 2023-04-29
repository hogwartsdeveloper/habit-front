import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthorModalComponent } from '../author-modal/author-modal.component';
import { AuthorType } from '../models/author.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [MatDialogModule],
  standalone: true,
})
export class ToolbarComponent {
  constructor(private dialog: MatDialog) {}

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
}
